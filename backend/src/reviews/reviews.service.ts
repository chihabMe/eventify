import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateReviewDto } from './reviews.dto';
import { CustomBadRequestException } from 'src/common/exceptions/custom-badrequest.exception';

@Injectable()
export class ReviewsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getEventReviews(eventId: string) {
    return this.prismaService.review.findMany({
      where: {
        eventId: eventId,
      },
    });
  }
  async createEventReview({
    userId,
    eventId,
    data,
  }: {
    userId: string;
    data: CreateReviewDto;
    eventId: string;
  }) {
    // Check if the event exists
    const event = await this.prismaService.event.findUnique({
      where: { id: eventId },
      select: { id: true, startsAt: true, endsAt: true },
    });

    if (!event) {
      throw new CustomBadRequestException({
        message: 'Event does not exist',
        errors: [{ field: 'event', message: 'Event does not exist' }],
      });
    }
    if (event.startsAt > new Date()) {
      throw new CustomBadRequestException({
        message: 'Event has not started yet',
        errors: [{ field: 'event', message: 'Event has not started yet' }],
      });
    }

    // Check if the user has already reviewed this event
    const existingReview = await this.prismaService.review.findFirst({
      where: { userId, eventId: eventId },
    });

    if (existingReview) {
      throw new CustomBadRequestException({
        message: 'User has already reviewed this event',
        errors: [{ field: 'review', message: 'Review already exists' }],
      });
    }

    // Check if the user has booked the event
    const hasBooking = await this.prismaService.booking.findFirst({
      where: { userId, eventId: eventId },
      select: { id: true },
    });

    if (!hasBooking) {
      throw new CustomBadRequestException({
        message: 'User has not booked this event',
        errors: [{ field: 'booking', message: 'Booking required to review' }],
      });
    }

    // Create the review
    return this.prismaService.review.create({
      data: {
        userId,
        eventId,
        ...data,
      },
    });
  }
  async deleteReview(id: string) {
    const review = await this.prismaService.review.findUnique({
      where: { id },
    });
    if (!review) {
      throw new CustomBadRequestException({
        message: 'Review does not exist',
        errors: [{ field: 'review', message: 'Review does not exist' }],
      });
    }
    return this.prismaService.review.delete({
      where: { id },
    });
  }
}
