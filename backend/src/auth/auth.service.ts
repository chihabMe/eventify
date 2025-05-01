import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { HashService } from './hash/hash.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './auth.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: LoginDto) {
    const user = await this.validateUser(data.email, data.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
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
