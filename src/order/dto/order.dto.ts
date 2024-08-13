import { EnumOrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { OrderItemDto } from './order-item.dto';

export class OrderDto {
  @IsOptional()
  @IsEnum(EnumOrderStatus)
  status: EnumOrderStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
