import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() data: LoginDto) {
    const tokens = await this.authService.login(data);
    return {
      message: 'Login successful',
      tokens,
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
}
