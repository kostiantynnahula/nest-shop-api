import { IsDefined, IsOptional, IsString } from 'class-validator';

export class CreateStoreDto {
  @IsDefined()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}
