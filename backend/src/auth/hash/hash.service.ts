import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcryptjs';

@Injectable()
export class HashService {
  async hashPassword(password: string): Promise<string> {
    return hash(password, 12);
  }
  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    {
      return compare(password, hashedPassword);
    }
  }
}
