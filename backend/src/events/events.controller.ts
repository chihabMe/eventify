import { Body, Controller, Post, Request } from '@nestjs/common';
import { CreateEventCategoryDto, CreateEventDto } from './event.dto';
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

  @Post('/categories')
  @isAdmin()
  async createCategory(@Body() data: CreateEventCategoryDto) {
    const category = await this.eventsService.createEventCategory(data);
    return {
      message: 'Event category created successfully',
      category,
    };
  }
}
