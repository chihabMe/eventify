import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password is required' }),
});

export class LoginDto extends createZodDto(LoginSchema) {}
