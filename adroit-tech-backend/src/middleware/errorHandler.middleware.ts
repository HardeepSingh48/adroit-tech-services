import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '../shared/errors';
import { logger } from '../config/logger.config';

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const requestId = req.requestId || 'unknown';

  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error('Operational error', {
        requestId,
        path: req.path,
        method: req.method,
        statusCode: err.statusCode,
        errorCode: err.errorCode,
        message: err.message,
        stack: err.stack,
      });
    } else {
      logger.warn('Client error', {
        requestId,
        statusCode: err.statusCode,
        errorCode: err.errorCode,
        message: err.message,
      });
    }

    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      errorCode: err.errorCode,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
      requestId,
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(err, req, res, requestId);
  }

  logger.error('Unhandled error', {
    requestId,
    path: req.path,
    method: req.method,
    message: err.message,
    stack: err.stack,
  });

  return res.status(500).json({
    success: false,
    statusCode: 500,
    errorCode: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred.',
    requestId,
  });
};

function handlePrismaError(err: Prisma.PrismaClientKnownRequestError, _req: Request, res: Response, requestId: string) {
  switch (err.code) {
    case 'P2002': {
      const target = Array.isArray(err.meta?.target) ? (err.meta?.target as string[]).join(', ') : 'field';
      return res.status(409).json({
        success: false,
        statusCode: 409,
        errorCode: 'DUPLICATE_RECORD',
        message: `A record with this ${target} already exists.`,
        requestId,
      });
    }
    case 'P2025':
      return res.status(404).json({
        success: false,
        statusCode: 404,
        errorCode: 'NOT_FOUND',
        message: 'The requested resource was not found.',
        requestId,
      });
    default:
      return res.status(500).json({
        success: false,
        statusCode: 500,
        errorCode: 'DATABASE_ERROR',
        message: 'A database error occurred.',
        requestId,
      });
  }
}
