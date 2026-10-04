import type { RequestHandler } from 'express';
import { logger } from '../utils/index.js';

export const requestLogger: RequestHandler = (request, response, next) => {
  const startedAt = Date.now();

  logger.info('HTTP request started', {
    method: request.method,
    path: request.originalUrl,
  });

  response.on('finish', () => {
    logger.info('HTTP request finished', {
      method: request.method,
      path: request.originalUrl,
      statusCode: response.statusCode,
      durationMs: Date.now() - startedAt,
    });
  });

  next();
};
