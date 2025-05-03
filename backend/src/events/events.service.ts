import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  CreateEventCategoryDto,
  CreateEventDto,
  UpdateEventCategoryDto,
} from './event.dto';
import slugify from 'slugify';
import { CustomBadRequestException } from 'src/common/exceptions/custom-badrequest.exception';
import { Role, User } from 'generated/prisma';

@Injectable()
export class EventsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getEventDetailsWithSlug(slug: string) {
    return this.prismaService.event.findUnique({
      where: {
        slug,
      },
      include: {
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
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
  async generateEventCategorySlug(name: string): Promise<string> {
    const slug = this.generateSlug(name);
    const exists = await this.prismaService.eventCategory.findUnique({
      where: {
        slug,
      },
    });
    if (exists) {
      return this.generateEventCategorySlug(
        name + '-' + Math.floor(Math.random() * 1000),
      );
    }
    return slug;
  }
  async getEventCategoryById(id: string) {
    return this.prismaService.eventCategory.findUnique({
      where: {
        id,
      },
    });
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
    const category = await this.getEventCategoryById(data.categoryId);
    if (!category) {
      throw new CustomBadRequestException({
        message: 'Category not found',
        errors: [{ field: 'categoryId', message: 'Category not found' }],
      });
    }

    const event = await this.prismaService.event.create({
      data: {
        slug,
        ...data,
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
  async getAllEvents() {
    return this.prismaService.event.findMany({
      include: {
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
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
  }
  async createEventCategory(data: CreateEventCategoryDto) {
    try {
      const slug = await this.generateEventCategorySlug(data.name);
      const category = await this.prismaService.eventCategory.create({
        data: {
          slug,
          ...data,
        },
      });
      if (!category) {
        throw new InternalServerErrorException(
          'Failed to create event category',
        );
      }
      return category;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Failed to create event category');
    }
  }
  async getAllEventCategories() {
    return this.prismaService.eventCategory.findMany();
  }
  async deleteEventCategory(id: string) {
    const category = await this.prismaService.eventCategory.findUnique({
      where: { id },
    });
    if (!category) {
      throw new CustomBadRequestException({
        message: 'Event category not found',
        errors: [{ field: 'id', message: 'Event category not found' }],
      });
    }
    return this.prismaService.eventCategory.delete({
      where: { id },
    });
  }
  async updateEventCategory(id: string, data: UpdateEventCategoryDto) {
    const category = await this.prismaService.eventCategory.findUnique({
      where: { id },
    });
    if (!category) {
      throw new CustomBadRequestException({
        message: 'Event category not found',
        errors: [{ field: 'id', message: 'Event category not found' }],
      });
    }
    return this.prismaService.eventCategory.update({
      where: { id },
      data,
    });
  }
}
