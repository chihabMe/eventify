import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreateEventDto } from './event.dto';
import { Request as ExpressRequest } from 'express';
import { EventsService } from './events.service';
import { EmailService } from 'src/email/email.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'generated/prisma';
import { StorageService } from 'src/storage/storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomBadRequestException } from 'src/common/exceptions/custom-badrequest.exception';
import { isOrganizer } from 'src/common/decorators/is-organizer.decorator';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly emailService: EmailService,
    private readonly StorageService: StorageService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new event',
    description: 'Create a new event and send confirmation email',
  })
  @ApiResponse({
    status: 201,
    description: 'Event created successfully',
    type: CreateEventDto,
  })
  @UseInterceptors(FileInterceptor('image'))
  @Roles(Role.ORGANIZER, Role.ADMIN)
  async create(
    @Body() data: CreateEventDto,
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
    const organizerId = req.user!.id;
    const imageUrl = await this.StorageService.uploadFile(image);
    const event = await this.eventsService.createEvent({
      data,
      imageUrl,
      organizerId,
    });
    await this.emailService.sendEventCreatingEmail({
      event,
      user: req.user!,
    });
    return {
      message: 'Event created successfully',
      event,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Get all events',
    description: 'Get a list of all events',
  })
  @ApiResponse({
    status: 200,
    description: 'List of events',
    type: [CreateEventDto],
  })
  @ApiOperation({
    summary: 'Get all events',
    description: 'Get a list of all events',
  })
  @ApiResponse({
    status: 200,
    description: 'List of events',
    type: [CreateEventDto],
  })
  async getAllEvents(
    @Query('featured') featured: string,
    @Query('page') page: string,
    @Query('category') category: string,
  ) {
    let p = 1;
    try {
      p = parseInt(page) || 1;
    } catch (err) {
      console.error(err);
      throw new CustomBadRequestException({
        message: 'Invalid page',
        errors: [],
      });
    }
    const events = await this.eventsService.getAllEvents({
      filters: {
        featured: featured === 'true' ? true : undefined,
        category,
        page: p,
      },
    });
    return {
      pagination: {
        page: p,
        results: events.length,
      },
      data: events,
    };
  }

  @ApiOperation({
    summary: 'Get current logged in organizer events',
    description:
      'This route will return the created events for the current logged in organizer',
  })
  @ApiResponse({
    status: 200,
    description: 'Event list  fetched successfully',
    type: CreateEventDto,
  })
  @Get('me')
  @isOrganizer()
  async getCurrentLoggedOrganizerEvents(@Request() req: ExpressRequest) {
    const userId = req.user!.id;
    const events = await this.eventsService.getCurrentOrganizer(userId);
    return {
      data: events,
    };
  }

  @ApiOperation({
    summary: 'Get event details by ID',
    description: 'Get details of a specific event by its ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Event details fetched successfully',
    type: CreateEventDto,
  })
  @Get(':slug')
  async getEventBySlug(
    @Param('slug') slug: string,
    @Request() req: ExpressRequest,
  ) {
    const userId = req.user!.id;
    const event = await this.eventsService.getEventDetailsWithSlug(
      slug,
      userId,
    );
    return {
      data: event,
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an event',
    description: 'Delete an event by its ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Event deleted successfully',
  })
  @Roles(Role.ORGANIZER, Role.ADMIN)
  async deleteEvent(@Param('id') id: string, @Request() req: ExpressRequest) {
    //checking if the user id is the same as the one stored in the event
    await this.eventsService.deleteEvent(req.user!, id);
    return {
      message: 'Event deleted successfully',
    };
  }
}
