import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateEventSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(100, 'Title must be at most 100 characters long'),
  description: z.string().min(1, { message: 'Description is required' }),
  location: z.string().min(1, { message: 'Location is required' }),
  startDate: z.date({
    required_error: 'Start date is required',
    invalid_type_error: 'Start date must be a valid date',
  }),
  endDate: z.date({
    required_error: 'End date is required',
    invalid_type_error: 'End date must be a valid date',
  }),
  capacity: z.number().min(1, { message: 'Capacity must be at least 1' }),
  tags: z.array(z.string()).optional(),
  categoryId: z.string(),
});
export const UpdateEventSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  capacity: z.number().optional(),
  tags: z.array(z.string()).optional(),
  categoryId: z.string().optional(),
});

export class CreateEventDto extends createZodDto(CreateEventSchema) {}
export class UpdateEventDto extends createZodDto(UpdateEventSchema) {}
