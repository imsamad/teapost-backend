import { AnySchema } from 'yup';
import { Request, Response, NextFunction } from 'express';

import { ErrorResponse, validateYupSchema } from '../lib/utils';

const validateSchema =
  (schema?: AnySchema, abortEarly = false) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      schema = schema ? schema : (req.__YUP_SCHEMA__ as AnySchema);
      req.body.__YUP_SCHEMA__ && delete req.body.__YUP_SCHEMA__;
      await validateYupSchema(
        schema,
        {
          body: req.body,
          query: req.query,
          params: req.params,
        },
        abortEarly
      );

      return next();
    } catch (yupError: any) {
      return next(
        ErrorResponse(
          422,
          yupError ? yupError : 'Provide Proper Data,for further processing.'
        )
      );
    }
  };

export default validateSchema;
