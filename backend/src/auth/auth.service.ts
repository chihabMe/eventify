import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { HashService } from './hash/hash.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './auth.dto';
import { PrismaService } from 'src/prisma.service';
import * as dayjs from 'dayjs';
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
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      access_token: await this.generateAccessToken(user.id, user.role),
      refresh_token: await this.generateRefreshToken(user.id),
    };
  }
  async generateAccessToken(userId: string, role: string) {
    return this.jwtService.signAsync({ sub: userId, role });
  }

  async generateRefreshToken(userId: string): Promise<string> {
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
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      return null;
    }
    const isPasswordValid = await this.hashService.comparePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      return null;
    }
    return user;
  }
}
