import { RequestHandler } from 'express';
import { NotFoundError } from '../shared/errors';

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
};
