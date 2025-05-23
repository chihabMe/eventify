import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateEventDto } from './event.dto';
import slugify from 'slugify';
import { CustomBadRequestException } from 'src/common/exceptions/custom-badrequest.exception';
import { Role, User } from 'generated/prisma';
import { CategoriesService } from 'src/categories/categories.service';
import { PAGE_SIZE } from 'src/common/constants';
import { BookingsService } from 'src/bookings/bookings.service';
import { ReviewsService } from 'src/reviews/reviews.service';

@Injectable()
export class EventsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly categoriesService: CategoriesService,
    private readonly bookingService: BookingsService,
    private readonly reviewsService: ReviewsService,
  ) {}

  async getEventDetailsWithSlug(slug: string, userId?: string) {
    const event = await this.prismaService.event.findUnique({
      where: {
        slug,
      },
      include: {
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
    });
    if (!event) {
      throw new CustomBadRequestException({
        message: 'Event not found',
        errors: [{ field: 'slug', message: 'Event not found' }],
      });
    }
    const existingBookingForTheUser = userId
      ? await this.prismaService.booking.findFirst({
          where: {
            eventId: event.id,
            userId,
          },
        })
      : null;
    const booked = existingBookingForTheUser !== null;
    return { ...event, booked };
  }
  generateSlug(title: string): string {
    return slugify(title, {
      lower: true,
      strict: true,
    });
  }
  async generateEventSlug(title: string): Promise<string> {
    const slug = this.generateSlug(title);
    const exists = await this.prismaService.event.findUnique({
      where: {
        slug,
      },
    });
    if (exists) {
      return this.generateEventSlug(
        title + '-' + Math.floor(Math.random() * 1000),
      );
    }
    return slug;
  }
  async createEvent({
    organizerId,
    imageUrl,
    data,
  }: {
    organizerId: string;
    data: CreateEventDto;
    imageUrl: string;
  }) {
    const slug = await this.generateEventSlug(data.title);
    const category = await this.categoriesService.getEventCategoryById(
      data.categoryId,
    );
    if (!category) {
      throw new CustomBadRequestException({
        message: 'Category not found',
        errors: [{ field: 'categoryId', message: 'Category not found' }],
      });
    }

    const uniqueTags = [...new Set(data.tags)];
    const event = await this.prismaService.event.create({
      data: {
        slug,
        ...data,
        tags: uniqueTags,
        organizerId: organizerId,
        imageUrl,
        categoryId: data.categoryId,
        startsAt: new Date(data.startsAt),
        endsAt: new Date(data.endsAt),
      },
    });
    if (!event) {
      throw new InternalServerErrorException('Failed to create event');
    }
    return event;
  }

  // async updateEvent(id: number, data: any) {
  //     return this.prismaService.event.update({
  //         where: { id },
  //         data,
  //     });
  // }

  async deleteEvent(user: Omit<User, 'password'>, id: string) {
    const event = await this.prismaService.event.findUnique({
      where: { id },
    });
    if (!event) {
      throw new CustomBadRequestException({
        message: 'Event not found',
        errors: [{ field: 'id', message: 'Event not found' }],
      });
    }
    if (event.organizerId !== user.id && user.role !== Role.ADMIN) {
      throw new UnauthorizedException(
        'You are not authorized to delete this event',
      );
    }
    return this.prismaService.event.delete({
      where: { id },
    });
  }
  async getAllEvents({
    filters,
  }: {
    filters: {
      featured?: boolean;
      page: number;
      category?: string;
    };
  }) {
    const { page, category, featured } = filters;
    const skip = (page - 1) * PAGE_SIZE;
    return this.prismaService.event.findMany({
      skip,
      take: PAGE_SIZE,
      where: {
        isFeatured: featured,
        category: category
          ? {
              slug: category,
            }
          : undefined,
      },
      include: {
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        category: true,
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
    });
  }

  async getCurrentOrganizerEvents(organizerId: string) {
    return this.prismaService.event.findMany({
      where: {
        organizerId,
      },
    });
  }
  async getCurrentOrganizerEventsStats(organizerId: string) {
    const eventsCount = await this.prismaService.event.count({
      where: { organizerId },
    });
    const bookingsCount =
      await this.bookingService.getTotalOrganizerBookings(organizerId);
    const reviewsCount =
      await this.reviewsService.getTotalOrganizerReviews(organizerId);
    return {
      eventsCount,
      bookingsCount,
      reviewsCount,
    };
  }
}
