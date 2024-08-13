import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/utils/services/prisma.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';

@Injectable()
export class ColorService {
  constructor(private prisma: PrismaService) {}

  async getByStoreId(storeId: string) {
    return await this.prisma.color.findMany({
      where: {
        storeId,
      },
    });
  }

  async getById(id: string) {
    const color = await this.prisma.color.findUnique({
      where: {
        id,
      },
    });

    if (!color) {
      throw new NotFoundException('Color not found');
    }

    return color;
  }

  async create(storeId: string, data: CreateColorDto) {
    return await this.prisma.color.create({
      data: {
        ...data,
        storeId,
      },
    });
  }

  // TODO: Add store id
  async update(colorId: string, data: UpdateColorDto) {
    return await this.prisma.color.update({
      where: {
        id: colorId,
      },
      data,
    });
  }

  // TODO: Add store id
  async delete(colorId: string) {
    return await this.prisma.color.delete({
      where: {
        id: colorId,
      },
    });
  }
}
