import { z } from 'zod';

// DataPointSchema = Ponto no gráfico, definido por X e Y
const DataPointSchema = z.object({
  x: z.preprocess((val) => Number(val), z.number()),
  y: z.preprocess((val) => Number(val), z.number()),
});

export { DataPointSchema };
export type DataPoint = z.infer<typeof DataPointSchema>;

// LagrangePolynomialSchema = Valor do input enviado pelo usuário, onde polyomialString é a equação e wishedX é o valor de x desejado
const LagrangePolynomialSchema = z.object({
  polynomialString: z.string(),
  wishedX: z.preprocess((val) => Number(val), z.number()),
});

export { LagrangePolynomialSchema }
export type LagrangePolynomial = z.infer<typeof LagrangePolynomialSchema>