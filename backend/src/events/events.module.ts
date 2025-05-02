import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { EmailService } from 'src/email/email.service';

@Module({
  providers: [EventsService, EmailService],
  controllers: [EventsController],
})
export class EventsModule {}
