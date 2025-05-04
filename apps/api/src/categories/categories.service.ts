import { Injectable, InternalServerErrorException } from '@nestjs/common';
import slugify from 'slugify';
import { CustomBadRequestException } from 'src/common/exceptions/custom-badrequest.exception';
import {
  CreateEventCategoryDto,
  UpdateEventCategoryDto,
} from 'src/events/event.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

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
    const categories = await this.prismaService.eventCategory.findMany({
      include: {
        _count: {
          select: {
            events: true,
          },
        },
      },
    });
    return categories;
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

  generateSlug(title: string): string {
    return slugify(title, {
      lower: true,
      strict: true,
    });
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
}
