import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/utils/services/prisma.service';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getAll(userId: string) {
    return await this.prisma.product.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
      },
    });
  }

  private getSearchTermFilter(searchTerm: string) {
    return {
      OR: [
        {
          name: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
      ],
    };
  }

  async getByStoreId(storeId: string) {
    return await this.prisma.product.findMany({
      where: {
        storeId,
      },
      include: {
        category: true,
        color: true,
      },
    });
  }

  async getById(id: string) {
    const color = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
        color: true,
        reviews: true,
      },
    });

    if (!color) {
      throw new NotFoundException('Product not found');
    }

    return color;
  }

  async getByCategory(categoryId: string) {
    return await this.prisma.product.findMany({
      where: {
        categoryId,
      },
      include: {
        category: true,
        color: true,
      },
    });
  }

  async getMostPopular() {
    const mostPopularProducts = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    const productIds = mostPopularProducts.map((product) => product.productId);

    return await this.prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      include: {
        category: true,
      },
    });
  }

  async getSimilar(id: string) {
    const currentProduct = await this.getById(id);

    if (!currentProduct) {
      return [];
    }

    return await this.prisma.product.findMany({
      where: {
        categoryId: currentProduct.categoryId,
        id: {
          not: id,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
      },
    });
  }

  async create(storeId: string, data: ProductDto) {
    return await this.prisma.product.create({
      data: {
        ...data,
        storeId,
      },
    });
  }

  // TODO: Add store id
  async update(id: string, data: ProductDto) {
    return await this.prisma.product.update({
      where: {
        id,
      },
      data,
    });
  }

  // TODO: Add store id
  async delete(id: string) {
    return await this.prisma.product.delete({
      where: {
        id,
      },
    });
  }
}
