import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateEventCategoryDto,
  UpdateEventCategoryDto,
} from 'src/events/event.dto';
import { isAdmin } from 'src/common/decorators/is-admin.decorator';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({
    summary: 'Get All Categories',
    description: 'Get all categories',
  })
  @ApiResponse({
    status: 200,
    description: 'Event updated successfully',
  })
  @Get()
  async getAllCategories() {
    const categories = await this.categoriesService.getAllEventCategories();
    return {
      data: categories,
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
  @Post()
  @isAdmin()
  async createCategory(@Body() data: CreateEventCategoryDto) {
    const category = await this.categoriesService.createEventCategory(data);
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
  @Get(':id')
  async getCategory(@Param('id') id: string) {
    const category = await this.categoriesService.getEventCategoryById(id);
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
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    const category = await this.categoriesService.deleteEventCategory(id);
    return {
      message: 'Event category deleted successfully',
      category,
    };
  }
  @ApiOperation({
    summary: 'Update an event category',
    description: 'Update an existing event category by its ID',
  })
  @ApiResponse({
    status: 200,
    description: 'all categories',
  })
  @isAdmin()
  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() data: UpdateEventCategoryDto,
  ) {
    const category = await this.categoriesService.updateEventCategory(id, data);
    return {
      message: 'Event category updated successfully',
      category,
    };
  }
}
