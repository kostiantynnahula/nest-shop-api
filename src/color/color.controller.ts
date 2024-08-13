import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ColorService } from './color.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';

@Auth()
@Controller('colors')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Get('store/:storeId')
  async getByStoreId(@Param('storeId') storeId: string) {
    return this.colorService.getByStoreId(storeId);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.colorService.getById(id);
  }

  @Post(':storeId')
  async create(
    @Param('storeId') storeId: string,
    @Body() data: CreateColorDto,
  ) {
    // TODO: Add validate with store id

    return this.colorService.create(storeId, data);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateColorDto) {
    return this.colorService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.colorService.delete(id);
  }
}
