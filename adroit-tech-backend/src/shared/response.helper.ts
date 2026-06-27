import { Response } from 'express';
import { PaginatedResponse } from '../types/api.types';

export const sendSuccess = (
  res: Response,
  data: unknown,
  message = 'Success',
  statusCode = 200
) => {
  res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
  });
};

export const sendPaginated = (
  res: Response,
  result: PaginatedResponse<unknown>,
  message = 'Success'
) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message,
    data: result.data,
    meta: result.meta,
  });
};
