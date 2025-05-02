import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateEventSchema = z
  .object({
    title: z
      .string()
      .min(1, { message: 'Title is required' })
      .max(100, 'Title must be at most 100 characters long'),
    description: z.string().min(1, { message: 'Description is required' }),
    location: z.string().min(1, { message: 'Location is required' }),
    startsAt: z
      .string({
        required_error: 'Start date is required',
      })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Start date must be a valid date',
      }),
    endsAt: z
      .string({
        required_error: 'End date is required',
      })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'End date must be a valid date',
      }),

    capacity: z.number().min(1, { message: 'Capacity must be at least 1' }),
    tags: z.array(z.string()).optional(),
    categoryId: z.string(),
  })
  .superRefine((data, ctx) => {
    const startDate = new Date(data.startsAt);
    const endDate = new Date(data.endsAt);
    if (startDate >= endDate) {
      ctx.addIssue({
        message: 'End date must be after start date',
        code: 'invalid_date',
        path: ['endsAt'],
      });
    }
  });

export const UpdateEventSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  startsAt: z
    .string({
      required_error: 'Start date is required',
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Start date must be a valid date',
    })
    .optional(),
  ends: z
    .string({
      required_error: 'End date is required',
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'End date must be a valid date',
    })
    .optional(),
  capacity: z.number().optional(),
  tags: z.array(z.string()).optional(),
  categoryId: z.string().optional(),
});

const CreateEventCategorySchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
});

export class CreateEventDto extends createZodDto(CreateEventSchema) {}
export class UpdateEventDto extends createZodDto(UpdateEventSchema) {}
export class CreateEventCategoryDto extends createZodDto(
  CreateEventCategorySchema,
) {}
