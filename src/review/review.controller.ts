import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';
import { ReviewDto } from './dto/review.dto';

@Auth()
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('store/:storeId')
  async getByStoreId(@Param('storeId') storeId: string) {
    return this.reviewService.getByStoreId(storeId);
  }

  @Post(':productId/:storeId')
  async create(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
    @Param('productId') productId: string,
    @Body() data: ReviewDto,
  ) {
    return this.reviewService.create(data, userId, productId, storeId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.reviewService.deleteById(id, userId);
  }
}
