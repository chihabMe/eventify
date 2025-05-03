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
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Request } from 'express';
import { CreateBookingDto } from './bookings.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async createBooking(@Req() req: Request, @Body() data: CreateBookingDto) {
    const userId = req.user!.id;
    try {
      const booking = await this.bookingsService.createBooking({
        userId,
        data,
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

  @Get('my-bookings')
  async getMyBookings(@Req() req: Request) {
    const userId = req.user!.id;
    return this.bookingsService.getUserBookings(userId);
  }
}
