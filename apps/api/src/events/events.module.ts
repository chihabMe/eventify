import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { EmailService } from 'src/email/email.service';
import { StorageService } from 'src/storage/storage.service';
import { CategoriesService } from 'src/categories/categories.service';

@Module({
  providers: [EventsService, EmailService, StorageService, CategoriesService],
  controllers: [EventsController],
})
export class EventsModule {}
