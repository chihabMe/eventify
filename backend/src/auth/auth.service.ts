import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { HashService } from './hash/hash.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './auth.dto';
import { PrismaService } from 'src/prisma.service';
import * as dayjs from 'dayjs';
import { CustomBadRequestException } from 'src/common/exceptions/custom-badrequest.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    private readonly usersService: UsersService,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: LoginDto) {
    const user = await this.validateUser(data.email, data.password);
    if (!user) {
      throw new CustomBadRequestException({
        message: 'Invalid credentials',
        errors: [
          { field: 'email', message: 'Invalid email or password' },
          { field: 'password', message: 'Invalid email or password' },
        ],
      });
    }

    if (!user.isActive || !user.isEmailVerified) {
      throw new CustomBadRequestException({
        message: 'User is not active or email is not verified',
        errors: [
          { field: 'email', message: 'Invalid Email' },
          { field: 'password', message: 'Invalid Password' },
        ],
      });
    }

    return {
      access_token: await this.generateAccessToken(user.id, user.role),
      refresh_token: await this.generateRefreshToken(user.id),
    };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const refresh = await this.isRefreshTokenValid(refreshToken);
      if (!refresh) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      return {
        access_token: await this.generateAccessToken(refresh.sub, refresh.role),
      };
    } catch {
      // log error here
      throw new UnauthorizedException('Refresh token is not valid');
    }
  }

  async generateAccessToken(userId: string, role: string) {
    try {
      return await this.jwtService.signAsync({ sub: userId, role });
    } catch {
      throw new InternalServerErrorException('Failed to generate access token');
    }
  }

  isTokenValid(token: string) {
    try {
      const payload = this.jwtService.verify<{
        sub: string;
        role: string;
        expiredAt: Date;
      }>(token);

      if (!payload || payload.expiredAt < new Date()) {
        return null;
      }

      return payload;
    } catch {
      return null;
    }
  }

  async isRefreshTokenValid(token: string) {
    try {
      const payload = this.isTokenValid(token);
      if (!payload) return null;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const refreshToken = await this.prismaService.refreshToken.findFirst({
        where: { token, userId: payload.sub },
      });

      if (!refreshToken) return null;
      return payload;
    } catch {
      return null;
    }
  }

  async generateRefreshToken(userId: string): Promise<string> {
    try {
      const token = await this.jwtService.signAsync(
        { sub: userId },
        { expiresIn: '30d' },
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await this.prismaService.refreshToken.create({
        data: {
          token,
          userId,
          expiresAt: dayjs().add(30, 'days').toDate(),
        },
      });

      return token;
    } catch {
      throw new InternalServerErrorException(
        'Failed to generate refresh token',
      );
    }
  }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.usersService.findUserByEmail(email);
      if (!user) return null;

      const isPasswordValid = await this.hashService.comparePassword(
        password,
        user.password,
      );
      return isPasswordValid ? user : null;
    } catch {
      return null;
    }
  }
  async logout(refreshToken: string, userId: string) {
    try {
      const token = await this.prismaService.refreshToken.findFirst({
        where: { token: refreshToken, userId },
      });

      if (!token) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const refreshTokenRecord =
        await this.prismaService.refreshToken.findFirst({
          where: { token: refreshToken, userId },
        });

      if (!refreshTokenRecord) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      await this.prismaService.refreshToken.delete({
        where: { id: refreshTokenRecord.id },
      });

      return true;
    } catch {
      throw new InternalServerErrorException('Logout failed');
    }
  }
}
