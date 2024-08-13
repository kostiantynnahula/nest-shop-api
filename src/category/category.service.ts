import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/utils/services/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getByStoreId(storeId: string) {
    return await this.prisma.category.findMany({
      where: {
        storeId,
      },
    });
  }

  async getById(id: string) {
    const color = await this.prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!color) {
      throw new NotFoundException('Category not found');
    }

    return color;
  }

  async create(storeId: string, data: CreateCategoryDto) {
    return await this.prisma.category.create({
      data: {
        ...data,
        storeId,
      },
    });
  }

  // TODO: Add store id
  async update(colorId: string, data: UpdateCategoryDto) {
    return await this.prisma.category.update({
      where: {
        id: colorId,
      },
      data,
    });
  }

  // TODO: Add store id
  async delete(colorId: string) {
    return await this.prisma.category.delete({
      where: {
        id: colorId,
      },
    });
  }
}
