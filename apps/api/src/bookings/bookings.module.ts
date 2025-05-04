import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { EmailService } from 'src/email/email.service';

@Module({
  providers: [BookingsService, EmailService],
})
export class BookingsModule {}
