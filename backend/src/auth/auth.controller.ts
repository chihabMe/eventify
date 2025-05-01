import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request as ExpressRequest, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { jwtConstants } from 'src/common/constants';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() data: LoginDto,
  ) {
    const tokens = await this.authService.login(data);
    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,

      secure: process.env.NODE_ENV === 'production',

      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: jwtConstants.accessTokenLifetime.asNumber,
    });
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: jwtConstants.refreshTokenLifetime.asNumber,
    });

    return {
      message: 'Login successful',
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    const refreshToken = res.cookie['refresh_token'] as string;
    res.clearCookie('refresh_token');
    if (!refreshToken) {
      await this.authService.logout(refreshToken, res.locals.userId);
    }
    return {
      message: 'Logout successful',
    };
  }
  @Post('token/refresh')
  async refreshToken(@Body('refresh_token') refreshToken: string) {
    const tokens = await this.authService.refreshAccessToken(refreshToken);
    return {
      message: 'Refresh token successful',
      tokens,
    };
  }
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('me')
  getMe(@Request() req: ExpressRequest) {
    return req.user;
  }
}
