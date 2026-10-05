import type { Response } from 'express';
import type { ApiResponse } from '../types/api.js';

export function sendResponse<T>(
  response: Response,
  statusCode: number,
  message?: string,
  errorCode?: string,
  data?: T,
  isCustomError = false,
): void {
  const status = statusCode >= 200 && statusCode < 300 ? 'success' : 'error';
  const body: ApiResponse<T> = {
    status,
    statusCode,
    ...(message === undefined ? {} : { message }),
    ...(errorCode === undefined ? {} : { errorCode }),
    ...(status === 'error' ? { isCustomError } : {}),
    ...(data === undefined ? {} : { data }),
  };

  response.status(statusCode).json(body);
}
