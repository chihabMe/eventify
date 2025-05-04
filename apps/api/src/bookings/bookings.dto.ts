import { createZodDto } from 'nestjs-zod';
import z from 'zod';
const createBookingSchema = z.object({
  eventId: z.string(),
});
const cancelBookingSchema = z.object({
  bookingId: z.string(),
});

export class CreateBookingDto extends createZodDto(createBookingSchema) {}

export class CancelBookingDto extends createZodDto(cancelBookingSchema) {}
