import { IsOptional, IsString } from 'class-validator';

export class UpdateStoreDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
