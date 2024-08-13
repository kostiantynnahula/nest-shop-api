import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { IssueTokenResponse } from './interfaces/jwt.interface';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from '@prisma/client';
import { LoginDto } from './dto/login.dto';
import { verify } from 'argon2';
import { GoogleCallbackUserResponse } from './interfaces/google.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private userService: UserService,
  ) {}

  async login(data: LoginDto): Promise<User & IssueTokenResponse> {
    const user = await this.userService.getByEmailOrThrow(data.email);

    const isPasswordValid = await verify(user.password, data.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password or email');
    }

    const tokens = this.generateTokens(user.id);

    return { ...user, ...tokens };
  }

  async validateOAuthLogin(data: GoogleCallbackUserResponse) {
    const user = await this.userService.getOrCreate(data);

    const tokens = this.generateTokens(user.id);

    return { ...user, ...tokens };
  }

  async register(data: CreateUserDto): Promise<User & IssueTokenResponse> {
    const user = await this.userService.create(data);

    const tokens = this.generateTokens(user.id);

    return { ...user, ...tokens };
  }

  async refreshTokens(
    refreshToken: string,
  ): Promise<User & IssueTokenResponse> {
    const result = await this.jwt.verifyAsync(refreshToken);

    if (!result) {
      throw new BadRequestException('Invalid refresh token');
    }

    const user = await this.userService.getById(result.id);

    const tokens = this.generateTokens(user.id);

    return { ...user, ...tokens };
  }

  generateTokens(id: string): IssueTokenResponse {
    const data = { id };
    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}
