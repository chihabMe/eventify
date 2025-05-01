import { createZodValidationPipe } from 'nestjs-zod';
import { CustomZodException } from '../exceptions/zod-validation.exception';

export const CustomZodValidationPipe = createZodValidationPipe({
  createValidationException: (zodError) => new CustomZodException(zodError),
});
