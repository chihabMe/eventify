import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  // UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { jwtConstants } from 'src/common/constants';
import { isPublic } from 'src/common/decorators/is-public.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @isPublic()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login ' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginDto,
  })
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() data: LoginDto,
  ) {
    const { user, tokens } = await this.authService.login(data);
    res.cookie('access_token', `Bearer ${tokens.access_token}`, {
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
      user,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
  })
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
  @isPublic()
  @HttpCode(HttpStatus.OK)
  @Post('token/refresh')
  @ApiOperation({ summary: 'Refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Refresh token successful',
  })
  async refreshToken(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const refreshToken = req.cookies['refresh_token'] as string;
    const tokens = await this.authService.refreshAccessToken(refreshToken);
    res.cookie('access_token', `Bearer ${tokens.access_token}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: jwtConstants.refreshTokenLifetime.asNumber,
    });

    return {
      message: 'Refresh token successful',
      tokens,
    };
  }
  @HttpCode(HttpStatus.OK)
  @Get('me')
  @ApiOperation({ summary: 'Get user info' })
  @ApiResponse({
    status: 200,
    description: 'User info fetched successfully',
  })
  getMe(@Req() req: Request) {
    return req.user;
  }
}
