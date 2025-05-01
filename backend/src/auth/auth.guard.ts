import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersServices: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = this.authService.isTokenValid(token);
      if (!payload) {
        throw new UnauthorizedException();
      }
      const user = await this.usersServices.findUserById(payload.sub);
      if (!user) {
        throw new UnauthorizedException();
      }
      const userWithoutPassword = {
        ...user,
        password: undefined,
      };
      request['user'] = userWithoutPassword;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
  private extractTokenFromCookie(request: Request): string | undefined {
    const token = request.cookies['access_token'] as string;
    if (!token) {
      return undefined;
    }
    const tokenParts = token.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return undefined;
    }
    return tokenParts[1];
  }
}
