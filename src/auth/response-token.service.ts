import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import {
  EXPIRE_DAY_REFRESH_TOKEN,
  REFRESH_TOKEN_NAME,
} from 'src/auth/constants/token';

@Injectable()
export class ResponseTokenService {
  constructor(private readonly configService: ConfigService) {}

  addRefreshTokenToResponse(res: Response, refreshToken: string): void {
    const expiresIn = new Date();

    expiresIn.setDate(expiresIn.getDate() + EXPIRE_DAY_REFRESH_TOKEN);

    res.cookie(REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: this.configService.get('SERVER_DOMAIN'),
      expires: expiresIn,
      // secure: true,
      sameSite: 'none',
    });
  }

  removeRefreshTokenFromResponse(res: Response): void {
    const expiresIn = new Date();

    expiresIn.setDate(expiresIn.getDate() + EXPIRE_DAY_REFRESH_TOKEN);

    res.cookie(REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: this.configService.get('SERVER_DOMAIN'),
      expires: new Date(0),
      // secure: true,
      sameSite: 'none',
    });
  }
}
