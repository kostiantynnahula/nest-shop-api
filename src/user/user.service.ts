import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/utils/services/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'argon2';
import { GoogleCallbackUserResponse } from 'src/auth/interfaces/google.interface';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        stores: true,
        favorites: true,
        orders: true,
      },
    });
  }

  async getByEmail(email: string): Promise<User> {
    return this.prisma.user.findFirst({
      where: { email },
      include: {
        stores: true,
        favorites: true,
        orders: true,
      },
    });
  }

  async getByEmailOrThrow(email: string): Promise<User> {
    const user = await this.getByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getOrCreate(data: GoogleCallbackUserResponse): Promise<User> {
    const user = await this.getByEmail(data.email);

    if (!user) {
      return this.create({
        email: data.email,
        name: data.name,
        picture: data.picture,
      });
    }

    return user;
  }

  async create(data: CreateUserDto): Promise<User> {
    const password = await hash(data.password);
    return this.prisma.user.create({ data: { ...data, password } });
  }

  async toggleFavorite(productId: string, userId: string) {
    const user = await this.getById(userId);

    const isFavorite = user.favorites.some(
      (product) => product.id === productId,
    );

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        favorites: {
          [isFavorite ? 'disconnect' : 'connect']: { id: productId },
        },
      },
    });
  }
}
