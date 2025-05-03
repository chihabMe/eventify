import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { EmailService } from 'src/email/email.service';
import { StorageService } from 'src/storage/storage.service';

@Module({
  providers: [EventsService, EmailService, StorageService],
  controllers: [EventsController],
})
export class EventsModule {}
