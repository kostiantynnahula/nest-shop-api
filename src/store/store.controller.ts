import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Auth()
@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  async getAll(@CurrentUser('id') userId: string) {
    return this.storeService.getAll(userId);
  }

  @Get(':id')
  async getById(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.storeService.getById(id, userId);
  }

  @Post()
  async create(
    @Body() data: CreateStoreDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.storeService.create(userId, data);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateStoreDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.storeService.update(id, userId, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.storeService.delete(id, userId);
  }
}
