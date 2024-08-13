import { IsDefined, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsDefined()
  title: string;

  @IsString()
  @IsDefined()
  description: string;
}
