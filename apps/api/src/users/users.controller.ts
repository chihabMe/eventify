import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  InternalServerErrorException,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './users.dto';
import { EmailService } from 'src/email/email.service';
import { isPublic } from 'src/common/decorators/is-public.decorator';
import { isAdmin } from 'src/common/decorators/is-admin.decorator';
// import { Role } from 'generated/prisma';
import { StorageService } from 'src/storage/storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request as ExpressRequest } from 'express';
import { CustomBadRequestException } from 'src/common/exceptions/custom-badrequest.exception';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
    private readonly storageService: StorageService,
  ) {}

  @isPublic()
  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Create a new user and send verification email',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: CreateUserDto,
  })
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
  @ApiOperation({
    summary: 'Get all users',
    description: 'Get all users in the system',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: [CreateUserDto],
  })
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
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Get user details by user ID',
  })
  @ApiResponse({
    status: 200,
    description: 'User details',
    type: CreateUserDto,
  })
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
  @ApiOperation({
    summary: 'Delete a user',
    description: 'Delete a user by user ID',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
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
  // @Get('/organizers')
  // @isAdmin()
  // async findAllOrganizers() {
  //   try {
  //     const organizers = await this.usersService.findUsersByRole(
  //       Role.ORGANIZER,
  //     );
  //     return organizers;
  //   } catch (err) {
  //     console.error(err);
  //     return { message: 'Failed to fetch organizers' };
  //   }
  // }

  // Verify email route
  @isPublic()
  @Get('verify/:userId/:token')
  @ApiOperation({
    summary: 'Verify email',
    description: 'Verify user email using the verification token',
  })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully',
  })
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

  @Put('/upload-image')
  @ApiOperation({
    summary: 'Update user profile image',
    description: 'Update user profile image',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile image updated successfully',
  })
  @UseInterceptors(FileInterceptor('image'))
  async updateProfileImage(
    @Request() req: ExpressRequest,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({
            fileType: '.(png|jpeg|jpg)',
          }),
        ],
        errorHttpStatusCode: 422, // Unprocessable Entity
      }),
    )
    image: Express.Multer.File,
  ) {
    const userId = req.user!.id;
    if (!image) {
      throw new CustomBadRequestException({
        message: 'Image is required',
        errors: [{ field: 'image', message: 'Image is required' }],
      });
    }
    const imageUrl = await this.storageService.uploadFile(image);
    if (!imageUrl) {
      throw new InternalServerErrorException('Failed to upload image');
    }
    await this.usersService.updateProfileImage({
      userId,
      imageUrl,
    });
    return { message: 'Profile image updated successfully' };
  }
}
