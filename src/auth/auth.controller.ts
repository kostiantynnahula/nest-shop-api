import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ResponseTokenService } from './response-token.service';
import { REFRESH_TOKEN_NAME } from './constants/token';
import { GoogleCallbackResponse } from './interfaces/google.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseTokenService: ResponseTokenService,
  ) {}

  @HttpCode(200)
  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...response } = await this.authService.login(body);

    this.responseTokenService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  @Post('register')
  async register(
    @Body() body: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...response } = await this.authService.register(body);

    this.responseTokenService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  @Post('refresh-token')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshTokenFromCookies = req.cookies[REFRESH_TOKEN_NAME];

    if (!refreshTokenFromCookies) {
      this.responseTokenService.removeRefreshTokenFromResponse(res);
      throw new UnauthorizedException('Refresh token is missing');
    }

    const { refreshToken, ...response } = await this.authService.refreshTokens(
      refreshTokenFromCookies,
    );

    this.responseTokenService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    this.responseTokenService.removeRefreshTokenFromResponse(res);
    return { message: 'Logged out' };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: any) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(
    @Req() req: GoogleCallbackResponse,
    @Res() res: Response,
  ) {
    const { refreshToken, ...response } =
      await this.authService.validateOAuthLogin(req.user);

    this.responseTokenService.addRefreshTokenToResponse(res, refreshToken);

    res.redirect(
      `${process.env.CLIENT_URL}/dashboard?accessToken=${response.accessToken}`,
    );
  }
}
