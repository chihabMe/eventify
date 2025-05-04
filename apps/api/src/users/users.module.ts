import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { HashService } from 'src/auth/hash/hash.service';
import { EmailService } from 'src/email/email.service';
import { StorageService } from 'src/storage/storage.service';

@Module({
  providers: [UsersService, HashService, EmailService, StorageService],
  controllers: [UsersController],
})
export class UsersModule {}
