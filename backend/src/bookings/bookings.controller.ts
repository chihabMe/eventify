import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Body,
  Req,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Request, Response } from 'express';
import { CreateBookingDto } from './bookings.dto';
import { EmailService } from 'src/email/email.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly emailService: EmailService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a booking',
    description: 'Create a booking for an event',
  })
  @ApiResponse({
    status: 201,
    description: 'Booking created successfully',
  })
  async createBooking(@Req() req: Request, @Body() data: CreateBookingDto) {
    const userId = req.user!.id;
    try {
      const { booking, event } = await this.bookingsService.createBooking({
        userId,
        data,
      });
      await this.emailService.sendBookingConfirmationEmail({
        user: req.user!,
        event: event,
        booking,
      });
      return {
        message: 'Booking created successfully',
        booking,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Cancel a booking',
    description: 'Cancel a booking for an event',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking canceled successfully',
  })
  async cancelBooking(@Req() req: Request, @Param('id') bookingId: string) {
    const userId = req.user!.id;
    try {
      const booking = await this.bookingsService.cancelBooking(
        userId,
        bookingId,
      );
      return {
        message: 'Booking canceled successfully',
        booking,
      };
    } catch (err) {
      if (
        err instanceof ForbiddenException ||
        err instanceof NotFoundException
      ) {
        throw err;
      }
      throw new BadRequestException(err.message);
    }
  }

  @Get('event/:id')
  async getEventBookings(@Param('id') eventId: string) {
    const bookings = await this.bookingsService.getEventBookings(eventId);
    if (!bookings) {
      throw new NotFoundException('Event not found');
    }
    return bookings;
  }

  //this controller returns the bookings for the user
  @Get('user')
  async getMyBookings(@Req() req: Request) {
    const userId = req.user!.id;
    return this.bookingsService.getUserBookings(userId);
  }

  @Get('ticket/:id')
  async downloadTicket(
    @Param('id') bookingId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const booking = await this.bookingsService.getBookingById(bookingId);
    const stream = this.bookingsService.generateTicketStream({
      event: booking.event,
      user: req.user!,
      booking: booking,
    });
    if (!stream) {
      throw new NotFoundException('Ticket not found');
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="ticket-${bookingId}.pdf`,
    );

    // 4. Pipe the stream to the response
    stream.on('end', () => res.end());
    stream.on('error', (err) => {
      console.error(err);
      res.status(500).send('Error generating ticket');
    });
    stream.pipe(res, { end: false });
  }
}
