import { NextApiRequest, NextApiResponse } from 'next';
import { DataPoint, DataPointSchema, LagrangePolynomial, LagrangePolynomialSchema } from '../../interfaces';

import * as math from 'mathjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === 'POST') {
            const bodyDataPoints: unknown[] = req.body;

            const dataPoints: DataPoint[] = bodyDataPoints.map((dataPoint) => DataPointSchema.parse(dataPoint));

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

            return res.status(200).json({
                polynomial: math.simplify(composedPolynomial).toString(),
                dataPoints: dataPoints
            });
        }

        if (req.method === 'GET') {
            const polynomial: LagrangePolynomial = LagrangePolynomialSchema.parse(req.query)

            const compiledPolynomial = math.compile(polynomial.polynomialString);

            const wishedX = polynomial.wishedX;

            return res.status(200).json({
                wishedX,
                wishedY: compiledPolynomial.evaluate({ x: wishedX })
            });
        }
    } catch (error) {
        return res.status(500).json({ error });
    }



    return res.status(405).json({ error: 'Method not allowed' });
}