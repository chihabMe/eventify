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
  Put,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  CreateEventCategoryDto,
  CreateEventDto,
  UpdateEventCategoryDto,
} from './event.dto';
import { Request as ExpressRequest } from 'express';
import { EventsService } from './events.service';
import { EmailService } from 'src/email/email.service';
import { isAdmin } from 'src/common/decorators/is-admin.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'generated/prisma';
import { StorageService } from 'src/storage/storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
  getAllEvents() {
    return this.eventsService.getAllEvents();
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
  async getEventBySlug(@Param('slug') slug: string) {
    const event = await this.eventsService.getEventDetailsWithSlug(slug);
    return {
      event,
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

  @ApiOperation({
    summary: 'Update an event',
    description: 'Update an existing event by its ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Event updated successfully',
    type: CreateEventDto,
  })
  @Get('/categories')
  async getAllCategories() {
    const categories = await this.eventsService.getAllEventCategories();
    return {
      categories,
    };
  }

  @ApiOperation({
    summary: 'Create a new event category',
    description: 'Create a new event category',
  })
  @ApiResponse({
    status: 201,
    description: 'Event category created successfully',
    type: CreateEventCategoryDto,
  })
  @Post('/categories')
  @isAdmin()
  async createCategory(@Body() data: CreateEventCategoryDto) {
    const category = await this.eventsService.createEventCategory(data);
    return {
      message: 'Event category created successfully',
      category,
    };
  }

  @isAdmin()
  @ApiOperation({
    summary: 'Get event category by ID',
    description: 'Get details of a specific event category by its ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Event category details fetched successfully',
    type: CreateEventCategoryDto,
  })
  @Get('/categories/:id')
  async getCategory(@Param('id') id: string) {
    const category = await this.eventsService.getEventCategoryById(id);
    return {
      category,
    };
  }
  @isAdmin()
  @ApiOperation({
    summary: 'Delete an event category',
    description: 'Delete an event category by its ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Event category deleted successfully',
    type: CreateEventCategoryDto,
  })
  @Delete('/categories/:id')
  async deleteCategory(@Param('id') id: string) {
    const category = await this.eventsService.deleteEventCategory(id);
    return {
      message: 'Event category deleted successfully',
      category,
    };
  }
  @isAdmin()
  @ApiOperation({
    summary: 'Update an event category',
    description: 'Update an existing event category by its ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Event category updated successfully',
    type: CreateEventCategoryDto,
  })
  @Put('/categories/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() data: UpdateEventCategoryDto,
  ) {
    const category = await this.eventsService.updateEventCategory(id, data);
    return {
      message: 'Event category updated successfully',
      category,
    };
  }
}
