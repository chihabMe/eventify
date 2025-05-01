import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const UpdateBookSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }).optional(),
  author: z.string().min(1, { message: 'Author is required' }).optional(),
});
export class UpdateBookDto extends createZodDto(UpdateBookSchema) {}
