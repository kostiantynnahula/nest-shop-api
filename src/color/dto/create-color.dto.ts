import { IsDefined, IsString } from 'class-validator';

export class CreateColorDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsString()
  value: string;
}
