import { Body, Controller, Post, Request } from '@nestjs/common';
import { isOrganizer } from 'src/common/decorators/is-organizer.decorator';
import { CreateEventCategoryDto, CreateEventDto } from './event.dto';
import { Request as ExpressRequest } from 'express';
import { EventsService } from './events.service';
import { EmailService } from 'src/email/email.service';
import { isAdmin } from 'src/common/decorators/is-admin.decorator';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly emailService: EmailService,
  ) {}

  @Post()
  @isOrganizer()
  async create(@Body() data: CreateEventDto, @Request() req: ExpressRequest) {
    console.log(req.user);
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
