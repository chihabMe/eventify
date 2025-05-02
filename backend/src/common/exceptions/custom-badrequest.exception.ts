import { BadRequestException } from '@nestjs/common';

interface ValidationError {
  field: string;
  message: string;
}

interface CustomBadRequestExceptionParams {
  message: string;
  errors: ValidationError[];
  statusCode?: number;
  error?: string;
}

export class CustomBadRequestException extends BadRequestException {
  readonly statusCode: number;
  readonly message: string;
  readonly errors: ValidationError[];
  readonly error: string;

  constructor({
    message,
    errors,
    statusCode = 400,
    error = 'Bad Request',
  }: CustomBadRequestExceptionParams) {
    super({ message, errors, statusCode, error });
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.error = error;
  }
}
