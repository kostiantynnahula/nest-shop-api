import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/utils/services/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string): Promise<User> {
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

  async create(data: CreateUserDto): Promise<User> {
    const password = await hash(data.password);
    return this.prisma.user.create({ data: { ...data, password } });
  }
}
