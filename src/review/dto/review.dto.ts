import { IsDefined, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class ReviewDto {
  @IsDefined()
  @IsNotEmpty()
  text: string;

  @IsDefined()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}
