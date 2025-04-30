import { z } from 'zod';
import { createZodDto } from 'zod-dto';
const BookSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  author: z.string().min(1, { message: 'Author is required' }),
  publishedDate: z.date().optional(),
});

export class CreateBookDto extends createZodDto(BookSchema) {}
