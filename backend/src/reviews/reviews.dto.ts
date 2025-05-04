import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createReview = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(1).max(500),
});

export class CreateReviewDto extends createZodDto(createReview) {}
