import { IsNumber, IsString, IsDefined } from 'class-validator';

export class OrderItemDto {
  @IsDefined()
  @IsNumber()
  quantity: number;

  @IsDefined()
  @IsNumber()
  price: number;

  @IsDefined()
  @IsString()
  productId: string;

  @IsDefined()
  @IsString()
  storeId: string;
}
