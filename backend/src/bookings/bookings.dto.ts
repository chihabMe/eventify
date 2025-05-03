import { createZodDto } from 'nestjs-zod';
import z from 'zod';
const createBookingSchema = z.object({
  eventId: z.string().uuid(),
});
const cancelBookingSchema = z.object({
  bookingId: z.string().uuid(),
});

export class CreateBookingDto extends createZodDto(createBookingSchema) {}

export class CancelBookingDto extends createZodDto(cancelBookingSchema) {}
