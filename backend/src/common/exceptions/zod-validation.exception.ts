import { BadRequestException } from '@nestjs/common';
import { ZodError } from 'zod';

export class CustomZodException extends BadRequestException {
  constructor(error: ZodError) {
    // Format the Zod errors
    const formattedErrors = error.errors.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
      code: err.code,
    }));

    // Call the parent class constructor with the formatted error object
    super({
      message: 'Validation failed',
      errors: formattedErrors,
      statusCode: 400,
      error: 'Bad Request',
    });
  }
}
