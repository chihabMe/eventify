import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import {
  CreateEventCategoryDto,
  CreateEventDto,
  UpdateEventCategoryDto,
} from './event.dto';
import { Request as ExpressRequest } from 'express';
import { EventsService } from './events.service';
import { EmailService } from 'src/email/email.service';
import { isAdmin } from 'src/common/decorators/is-admin.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'generated/prisma';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly emailService: EmailService,
  ) {}

  @Post()
  @Roles(Role.ORGANIZER, Role.ADMIN)
  async create(@Body() data: CreateEventDto, @Request() req: ExpressRequest) {
    const organizerId = req.user!.id;
    const event = await this.eventsService.createEvent(organizerId, data);
    await this.emailService.sendEventCreatingEmail({
      event,
      user: req.user!,
    });
    return {
      message: 'Event created successfully',
      event,
    };
  }

  @Get()
  getAllEvents() {
    return this.eventsService.getAllEvents();
  }

  @Get(':slug')
  async getEventBySlug(@Param('slug') slug: string) {
    const event = await this.eventsService.getEventDetailsWithSlug(slug);
    return {
      event,
    };
  }

  @Delete(':id')
  @Roles(Role.ORGANIZER, Role.ADMIN)
  async deleteEvent(@Param('id') id: string, @Request() req: ExpressRequest) {
    //checking if the user id is the same as the one stored in the event
    await this.eventsService.deleteEvent(req.user!, id);
    return {
      message: 'Event deleted successfully',
    };
  }

  @Get('/categories')
  async getAllCategories() {
    const categories = await this.eventsService.getAllEventCategories();
    return {
      categories,
    };
  }

  @Post('/categories')
  @isAdmin()
  async createCategory(@Body() data: CreateEventCategoryDto) {
    const category = await this.eventsService.createEventCategory(data);
    return {
      message: 'Event category created successfully',
      category,
    };
  }

  @isAdmin()
  @Get('/categories/:id')
  async getCategory(@Param('id') id: string) {
    const category = await this.eventsService.getEventCategoryById(id);
    return {
      category,
    };
  }
  @isAdmin()
  @Delete('/categories/:id')
  async deleteCategory(@Param('id') id: string) {
    const category = await this.eventsService.deleteEventCategory(id);
    return {
      message: 'Event category deleted successfully',
      category,
    };
  }
  @isAdmin()
  @Put('/categories/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() data: UpdateEventCategoryDto,
  ) {
    const category = await this.eventsService.updateEventCategory(id, data);
    return {
      message: 'Event category updated successfully',
      category,
    };
  }
}
