import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/utils/services/prisma.service';
import { UniqueEmailValidator } from 'src/utils/validators/unique-email.validator';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, UniqueEmailValidator],
  exports: [UserService],
})
export class UserModule {}
