import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateReviewDto } from './reviews.dto';
import { ReviewsService } from './reviews.service';
import { isAdmin } from 'src/common/decorators/is-admin.decorator';

@ApiTags('reviews') // Tag for grouping in Swagger UI
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post(':eventId')
  @ApiOperation({ summary: 'Create a review for an event' }) // Description of the endpoint
  @ApiResponse({
    status: 201,
    description: 'Review created successfully',
    type: CreateReviewDto,
  }) // Response documentation
  @ApiResponse({ status: 400, description: 'Invalid input data' }) // Example of an error response
  async createReview(
    @Req() req: Request,
    @Body() data: CreateReviewDto,
    @Param('eventId') eventId: string,
  ) {
    const userId = req.user!.id;
    const review = await this.reviewsService.createEventReview({
      userId,
      eventId,
      data,
    });
    return {
      message: 'Review created successfully',
      review,
    };
  }

  @Get(':eventId')
  @ApiOperation({ summary: 'Get reviews for a specific event' }) // Description of the endpoint
  @ApiResponse({ status: 200, description: 'Reviews fetched successfully' }) // Response documentation
  @ApiResponse({ status: 404, description: 'Event not found' }) // Example of an error response
  async getEventReviews(@Param('eventId') eventId: string) {
    const reviews = await this.reviewsService.getEventReviews(eventId);
    return {
      message: 'Reviews fetched successfully',
      reviews,
    };
  }

  @Delete(':id')
  @isAdmin()
  @ApiOperation({ summary: 'Delete a review admin only' }) // Description of the endpoint
  @ApiResponse({ status: 200, description: 'Review deleted successfully' }) // Response documentation
  async deleteReview(@Param('id') id: string) {
    const review = await this.reviewsService.deleteReview(id);
    return {
      message: 'Review deleted successfully',
      review,
    };
  }
}
