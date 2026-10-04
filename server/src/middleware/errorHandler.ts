import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ApiException, InternalServerException } from '../exceptions/ApiException.js';
import { logger, sendResponse } from '../utils/index.js';

export const notFoundHandler: RequestHandler = (_request, response) => {
  sendResponse(response, 404, 'Route not found', '404');
};

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ApiException) {
    sendResponse(response, error.statusCode, error.message, error.errorCode, undefined, error.isCustomError);
    return;
  }

  logger.error('Unhandled server error', error instanceof Error ? { error } : { error: String(error) });
  const internalError = new InternalServerException();
  sendResponse(response, internalError.statusCode, internalError.message, internalError.errorCode);
};
