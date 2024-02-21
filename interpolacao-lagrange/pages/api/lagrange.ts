import { NextApiRequest, NextApiResponse } from 'next';
import { DataPoint, DataPointSchema } from '../../interfaces';

import * as math from 'mathjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const bodyDataPoints: unknown = req.body;

        if (!bodyDataPoints || !Array.isArray(bodyDataPoints) || bodyDataPoints.length === 0) {
            return res.status(400).json({ error: 'Data points are required' });
        }

        // validar os dados recebidos
        const dataPoints: DataPoint[] = bodyDataPoints.map((dataPoint) => DataPointSchema.parse(dataPoint));

        // calcular os valores de ln
        const getLnFunctionAsString = (n: number, dataPoints: DataPoint[]) => {
            const datapointsExcludingN = dataPoints.filter((_, i) => i !== n);

            const denominator = datapointsExcludingN.reduce((acc, dataPoint) => {
                return acc * (dataPoints[n].x - dataPoint.x);
            }, 1);

            const numerator = datapointsExcludingN.reduce((acc, dataPoint) => {
                return acc + `(x - ${dataPoint.x})`;
            }, '');

            return `${numerator} / ${denominator}`;
        }

        const composedPolynomial = dataPoints.reduce((acc, dataPoint, i) => {
            const ln = getLnFunctionAsString(i, dataPoints);

            return `${acc} + ${dataPoint.y} * (${ln})`;
        }, '');

        const compiledPolynomial = math.compile(composedPolynomial);

        return res.status(200).json({
            polynomial: math.simplify(composedPolynomial).toString(),
            dataPoints: dataPoints
        });
    }

    if (req.method === 'GET') {
        const body = req.body;

        if (!body || !body.polynomial || !body.wishedX) {
            return res.status(400).json({ error: 'Not all data was sent' });
        }

        const compiledPolynomial = math.compile(body.polynomial);

        const wishedX = body.wishedX;

        return res.status(200).json({
            wishedX,
            wishedY: compiledPolynomial.evaluate({ x: wishedX })
        });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}