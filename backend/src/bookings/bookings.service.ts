// src/bookings/bookings.service.ts
import { Injectable } from '@nestjs/common';
import { EventsService } from 'src/events/events.service';
import { PrismaService } from 'src/prisma.service';
import { CreateBookingDto } from './bookings.dto';
import { CustomBadRequestException } from 'src/common/exceptions/custom-badrequest.exception';

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventService: EventsService,
  ) {}

  async createBooking({
    userId,
    data,
  }: {
    userId: string;
    data: CreateBookingDto;
  }) {
    const event = await this.prisma.event.findFirst({
      where: { id: data.eventId },
      include: {
        bookings: true,
      },
    });

    if (!event)
      throw new CustomBadRequestException({
        message: 'Event not found',
        errors: [{ field: 'eventId', message: 'Event not found' }],
      });

    if (event.bookings.length >= event.capacity) {
      throw new CustomBadRequestException({
        message: 'Event is fully booked',
        errors: [],
      });
    }

    const booking = await this.prisma.booking.create({
      data: {
        eventId: data.eventId,
        userId: userId,
      },
    });

    return booking;
  }

  async cancelBooking(userId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking || booking.userId !== userId) {
      throw new CustomBadRequestException({
        message:
          'Booking not found or you are not authorized to cancel this booking',
        errors: [
          {
            field: 'bookingId',
            message:
              'Booking not found or you are not authorized to cancel this booking',
          },
        ],
      });
    }

    return this.prisma.booking.delete({ where: { id: bookingId } });
  }

  async getUserBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        event: true,
      },
    });
  }
}
