import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/utils/services/prisma.service';
import { ReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async getByStoreId(storeId: string) {
    return await this.prisma.review.findMany({
      where: {
        storeId,
      },
      include: {
        user: true,
      },
    });
  }

  async getById(id: string, userId: string) {
    const review = await this.prisma.review.findUnique({
      where: {
        id,
        userId,
      },
      include: {
        user: true,
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async create(
    data: ReviewDto,
    userId: string,
    productId: string,
    storeId: string,
  ) {
    return await this.prisma.review.create({
      data: {
        ...data,
        product: {
          connect: {
            id: productId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
        store: {
          connect: {
            id: storeId,
          },
        },
      },
    });
  }

  async deleteById(id: string, userId: string) {
    return await this.prisma.review.delete({
      where: {
        id,
        userId,
      },
    });
  }
}
