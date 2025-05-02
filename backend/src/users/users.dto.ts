import { Role } from 'generated/prisma';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateUserSchema = z
  .object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' }),
    passwordConfirmation: z
      .string()
      .min(8, { message: 'Password confirmation is required' }),
    userType: z.enum([Role.USER, Role.ORGANIZER], {
      errorMap: () => ({ message: 'Invalid user type' }),
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
  });

const UpdateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
