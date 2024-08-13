import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/utils/services/prisma.service';
import { IssueTokenResponse } from './interfaces/jwt.interface';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from '@prisma/client';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

// TODO: Move tokens related methods to a separate service
@Injectable()
export class AuthService {
  EXPIRE_DAY_REFRESH_TOKEN = 1;
  REFRESH_TOKEN_NAME = 'refresh_token';

  constructor(
    private jwt: JwtService,
    private userService: UserService,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async login(data: LoginDto): Promise<User & IssueTokenResponse> {
    const user = await this.validateUser(data);

    const tokens = this.issueToken(user.id);

    return { ...user, ...tokens };
  }

  async validateOAuthLogin(req: any) {
    const user = await this.userService.getByEmail(req.user.email);

    if (!user) {
      const newUser = await this.prisma.user.create({
        data: {
          email: req.user.email,
          name: req.user.name,
          picture: req.user.picture,
        },
        include: {
          stores: true,
          favorites: true,
          orders: true,
        },
      });

      const tokens = this.issueToken(newUser.id);

      return { ...newUser, ...tokens };
    }

    const tokens = this.issueToken(user.id);

    return { ...user, ...tokens };
  }

  async register(data: CreateUserDto): Promise<User & IssueTokenResponse> {
    // TODO: Implement validateion on the dto level
    const oldUser = await this.userService.getByEmail(data.email);

    if (oldUser) {
      throw new BadRequestException('User already exists');
    }

    const user = await this.userService.create(data);

    const tokens = this.issueToken(user.id);

    return { ...user, ...tokens };
  }

  issueToken(userId: string): IssueTokenResponse {
    const data = { id: userId };
    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async getNewTokens(refreshToken: string): Promise<User & IssueTokenResponse> {
    const result = await this.jwt.verifyAsync(refreshToken);

    if (!result) {
      throw new BadRequestException('Invalid refresh token');
    }

    const user = await this.userService.getById(result.id);

    const tokens = this.issueToken(user.id);

    return { ...user, ...tokens };
  }

  private async validateUser(data: LoginDto): Promise<User> {
    const user = await this.userService.getByEmail(data.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string): void {
    const expiresIn = new Date();

    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: this.configService.get('SERVER_DOMAIN'),
      expires: expiresIn,
      // secure: true,
      sameSite: 'none',
    });
  }

  removeRefreshTokenFromResponse(res: Response): void {
    const expiresIn = new Date();

    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: this.configService.get('SERVER_DOMAIN'),
      expires: new Date(0),
      // secure: true,
      sameSite: 'none',
    });
  }
}
