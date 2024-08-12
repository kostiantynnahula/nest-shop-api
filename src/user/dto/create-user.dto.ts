import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
