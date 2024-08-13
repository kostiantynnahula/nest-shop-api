import {
  ArrayNotEmpty,
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class ProductDto {
  @IsDefined()
  @IsString()
  title: string;

  @IsDefined()
  @IsString()
  description: string;

  @IsDefined()
  @IsNumber()
  price: number;

  @IsDefined()
  @IsArray()
  @ArrayNotEmpty()
  @IsNotEmpty({ each: true })
  images: string[];

  @IsDefined()
  @IsString()
  categoryId: string;

  @IsDefined()
  @IsString()
  colorId: string;
}
