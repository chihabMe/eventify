import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  // HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { CustomBadRequestException } from '../exceptions/custom-badrequest.exception';

@Catch(CustomBadRequestException)
export class CustomBadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: CustomBadRequestException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Extract relevant details from the exception
    const status = exception.statusCode ?? 400; // Default to 400 if not provided
    const error = exception.error || 'Bad Request';
    const message = exception.message || 'An error occurred';
    const errors = exception.errors || [];

    // Send a structured error response
    response.status(status).json({
      statusCode: status,
      error,
      message,
      errors,
    });
  }
}
