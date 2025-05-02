import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateEventDto } from './event.dto';
import slugify from 'slugify';
import { CustomBadRequestException } from 'src/common/exceptions/custom-badrequest.exception';

@Injectable()
export class EventsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getEventDetailsWithSlug(slug: string) {
    return this.prismaService.event.findUnique({
      where: {
        slug,
      },
      include: {
        organizer: true,
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
  async generateSlug(title: string): Promise<string> {
    const slug = slugify(title, {
      lower: true,
      strict: true,
    });
    const exists = await this.prismaService.event.findUnique({
      where: {
        slug,
      },
    });
    if (exists) {
      return this.generateSlug(title + '-' + Math.floor(Math.random() * 1000));
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

  async createEvent(organizerId: string, data: CreateEventDto) {
    const slug = await this.generateSlug(data.title);
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
        categoryId: data.categoryId,
        startsAt: data.startDate,
        endsAt: data.endDate,
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

  async deleteEvent(id: string) {
    return this.prismaService.event.delete({
      where: { id },
    });
  }
  async getAllEvents() {
    return this.prismaService.event.findMany({
      include: {
        organizer: true,
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
}
