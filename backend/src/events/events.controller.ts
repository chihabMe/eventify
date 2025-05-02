import { Body, Controller, Post, Res } from '@nestjs/common';
import { isOrganizer } from 'src/common/decorators/is-organizer.decorator';
import { CreateEventDto } from './event.dto';
import { Request, Response } from 'express';
import { EventsService } from './events.service';
import { EmailService } from 'src/email/email.service';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly emailService: EmailService,
  ) {}

  @Post()
  @isOrganizer()
  async create(@Body() data: CreateEventDto, @Res() req: Request) {
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
}
