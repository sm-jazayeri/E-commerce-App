import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

const validateRequest = (schema: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    res.status(400).json({ message: 'Validation Error', err });
  }
};

export default validateRequest;
