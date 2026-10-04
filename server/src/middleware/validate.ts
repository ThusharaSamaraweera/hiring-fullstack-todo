import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { BadRequestException } from '../exceptions/ApiException.js';
import { logger } from '../utils/index.js';

export function validate(schema: ZodType, source: 'body' | 'params' | 'query'): RequestHandler {
  return (request, _response, next) => {
    logger.info('Validating request', { source });
    const result = schema.safeParse(request[source]);

    if (!result.success) {
      logger.warn('Request validation failed', {
        source,
        issue: result.error.issues[0]?.message,
      });
      next(new BadRequestException(result.error.issues[0]?.message));
      return;
    }

    Object.defineProperty(request, source, {
      configurable: true,
      enumerable: true,
      value: result.data,
      writable: true,
    });
    next();
  };
}
