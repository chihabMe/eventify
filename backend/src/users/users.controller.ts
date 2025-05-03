import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './users.dto';
import { EmailService } from 'src/email/email.service';
import { isPublic } from 'src/common/decorators/is-public.decorator';
import { isAdmin } from 'src/common/decorators/is-admin.decorator';
import { Role } from 'generated/prisma';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  @isPublic()
  @Post()
  async create(@Body() data: CreateUserDto) {
    const user = await this.usersService.createUser({
      data,
      imageUrl: '',
    });
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
      message: 'User created successfully please check your email to verify it',
      user,
    };
  }
  @Get()
  @isAdmin()
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

  @isAdmin()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.usersService.findUserById(id);
      return user;
    } catch (err) {
      console.error(err);
      return { message: 'Failed to fetch user' };
    }
  }

  // Delete user - Admin only
  @Delete(':id')
  @isAdmin()
  async remove(@Param('id') id: string) {
    try {
      await this.usersService.deleteUser(id);
      return { message: 'User deleted successfully' };
    } catch (err) {
      console.error(err);
      return { message: 'Failed to delete user' };
    }
  }

  // Get all organizers - Admin only
  @Get('/organizers')
  @isAdmin()
  async findAllOrganizers() {
    try {
      const organizers = await this.usersService.findUsersByRole(
        Role.ORGANIZER,
      );
      return organizers;
    } catch (err) {
      console.error(err);
      return { message: 'Failed to fetch organizers' };
    }
  }

  // Verify email route
  @isPublic()
  @Get('verify/:userId/:token')
  async verifyEmail(
    @Param('userId') userId: string,
    @Param('token') token: string,
  ) {
    try {
      const result = await this.usersService.verifyEmail(userId, token);
      if (result) {
        return { message: 'Email verified successfully' };
      }
      return { message: 'Invalid or expired verification token' };
    } catch (err) {
      console.error(err);
      return { message: 'Failed to verify email' };
    }
  }
}
