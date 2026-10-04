export class ApiException extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly errorCode: string,
    public readonly isCustomError = false,
  ) {
    super(message);
    this.name = 'ApiException';
  }
}

export class BadRequestException extends ApiException {
  constructor(message = 'Invalid request', errorCode = '400') {
    super(message, 400, errorCode);
    this.name = 'BadRequestException';
  }
}

export class NotFoundException extends ApiException {
  constructor(message = 'Resource not found', errorCode = '404') {
    super(message, 404, errorCode);
    this.name = 'NotFoundException';
  }
}

export class InternalServerException extends ApiException {
  constructor(message = 'An unexpected error occurred', errorCode = '500') {
    super(message, 500, errorCode);
    this.name = 'InternalServerException';
  }
}
