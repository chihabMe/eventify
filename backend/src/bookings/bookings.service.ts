// src/bookings/bookings.service.ts
import { Injectable } from '@nestjs/common';
// import { EventsService } from 'src/events/events.service';
import * as PDFDocument from 'pdfkit';
import { PrismaService } from 'src/prisma.service';
import { CustomBadRequestException } from 'src/common/exceptions/custom-badrequest.exception';
import { Booking, User } from 'generated/prisma';
import { PassThrough } from 'stream';

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    // private readonly eventService: EventsService,
  ) {}

  async createBooking({
    userId,
    eventId,
  }: {
    userId: string;
    eventId: string;
  }) {
    //if the user booked this event before, throw an error
    const existingBooking = await this.prisma.booking.findFirst({
      where: {
        userId,
        eventId: eventId,
      },
    });
    if (existingBooking) {
      throw new CustomBadRequestException({
        message: 'You have already booked this event',
        errors: [
          { field: 'eventId', message: 'You have already booked this event' },
        ],
      });
    }
    const event = await this.prisma.event.findFirst({
      where: { id: eventId },
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
        eventId,
        userId: userId,
      },
    });

    return { booking, event };
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
  async getEventBookings(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        bookings: {
          include: {
            user: true,
          },
        },
      },
    });
    if (!event) {
      throw new CustomBadRequestException({
        message: 'Event not found',
        errors: [{ field: 'eventId', message: 'Event not found' }],
      });
    }
    return event.bookings;
  }

  async getBookingById(bookingId: string) {
    const ticket = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        event: true,
      },
    });
    if (!ticket) {
      throw new CustomBadRequestException({
        message: 'Ticket not found',
        errors: [{ field: 'bookingId', message: 'Ticket not found' }],
      });
    }
    return ticket;
  }
  generateTicketStream({
    event,
    user,
    booking,
  }: {
    event: { title: string; startsAt: Date; endsAt: Date; location: string };
    user: Omit<User, 'password'>;
    booking: Booking;
  }): PassThrough {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const stream = new PassThrough();
    doc.pipe(stream);

    // === Header ===
    doc
      .rect(0, 0, doc.page.width, 80)
      .fill('#2E86DE')
      .fillColor('white')
      .fontSize(28)
      .text('🎟️ Event Ticket', 50, 25);

    doc.moveDown(2);

    // === Event Info ===
    doc
      .fillColor('#333')
      .fontSize(20)
      .text('Event Details', { underline: true })
      .moveDown();

    doc
      .fontSize(14)
      .text(`Title: ${event.title}`)
      .text(
        `Date: ${event.startsAt.toLocaleString()} - ${event.endsAt.toLocaleString()}`,
      )
      .text(`Location: ${event.location}`)
      .moveDown();

    // === User Info ===
    doc.fontSize(20).text('Attendee', { underline: true }).moveDown(0.5);

    doc
      .fontSize(14)
      .text(`Name: ${user.firstName} ${user.lastName}`)
      .text(`Email: ${user.email}`)
      .text(`Booking ID: ${booking.id}`)
      .moveDown();

    // === Footer / QR Placeholder ===
    doc
      .moveDown(2)
      .fontSize(12)
      .fillColor('#555')
      .text('Please bring this ticket to the event.', { align: 'center' });

    // Optional: Add a QR code image or barcode here
    // doc.image('path/to/qr.png', { fit: [100, 100], align: 'center' });

    doc.end();
    return stream;
  }
}
