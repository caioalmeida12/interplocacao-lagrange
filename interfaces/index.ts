// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

import { z } from 'zod';

const DataPointSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export { DataPointSchema };
export type DataPoint = z.infer<typeof DataPointSchema>;

const LagrangePolynomialSchema = z.object({
  polynomialString: z.string(),
  wishedX: z.number(),
});

export { LagrangePolynomialSchema }
export type LagrangePolynomial = z.infer<typeof LagrangePolynomialSchema>