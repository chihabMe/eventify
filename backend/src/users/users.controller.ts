import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './users.dto';
import { EmailService } from 'src/email/email.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { isPublic } from 'src/common/decorators/is-public.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  @isPublic()
  @Post()
  async create(@Body() data: CreateUserDto) {
    try {
      const user = await this.usersService.createUser(data);
      if (!user) {
        return {
          message: 'Failed to create user',
        };
      }
      const token = await this.usersService.generateEmailVerificationToken(
        user.id,
      );
      if (!token) {
        return {
          message: 'Failed to create user',
        };
      }

      const result = await this.emailService.sendVerificationEmail(
        user.email,
        user.id,
        token.token,
      );
      if (result.error) {
        console.error(result.error);
        throw new InternalServerErrorException();
      }

      return {
        message:
          'User created successfully please check your email to verify it',
        user,
      };
    } catch (err) {
      console.error(err);
      return {
        message: 'Failed to create user',
      };
    }
  }
  @Get()
  @Roles('USER')
  async findAll() {
    try {
      const users = await this.usersService.findAllUsers();
      return users;
    } catch (err) {
      console.error(err);
      return {
        message: 'Failed to fetch users',
      };
    }
  }
}
