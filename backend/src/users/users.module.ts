import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { HashService } from 'src/auth/hash/hash.service';
import { EmailService } from 'src/email/email.service';

@Module({
  providers: [UsersService, HashService, EmailService],
  controllers: [UsersController],
})
export class UsersModule {}
