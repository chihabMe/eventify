import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { HashService } from 'src/auth/hash/hash.service';

@Module({
  providers: [UsersService, HashService],
  controllers: [UsersController],
})
export class UsersModule {}
