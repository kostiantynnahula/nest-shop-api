import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/utils/services/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  async getAll(userId: string) {
    return await this.prisma.store.findMany({
      where: {
        userId,
      },
    });
  }

  async getById(id: string, userId: string) {
    const store = await this.prisma.store.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    return store;
  }

  async create(userId: string, data: CreateStoreDto) {
    return await this.prisma.store.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async update(storeId: string, userId: string, data: UpdateStoreDto) {
    return await this.prisma.store.update({
      where: {
        id: storeId,
        userId,
      },
      data,
    });
  }

  async delete(storeId: string, userId: string) {
    return await this.prisma.store.delete({
      where: {
        id: storeId,
        userId,
      },
    });
  }
}
