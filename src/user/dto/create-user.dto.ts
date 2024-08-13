import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  Validate,
} from 'class-validator';
import { UniqueEmailValidator } from 'src/utils/validators/unique-email.validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  @Validate(UniqueEmailValidator)
  email: string;

  @IsStrongPassword()
  password?: string;

  @IsOptional()
  @IsString()
  picture?: string;
}
