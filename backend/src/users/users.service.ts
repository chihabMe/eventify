import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { HashService } from 'src/auth/hash/hash.service';
import { CreateUserDto, UpdateUserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashService: HashService,
  ) {}
  async createUser(data: CreateUserDto) {
    const { password, userType, ...rest } = data;
    const hashedPassword = await this.hashService.hashPassword(password);

    return await this.prisma.user.create({
      data: {
        email: rest.email,
        firstName: rest.firstName,
        lastName: rest.lastName,
        password: hashedPassword,
        role: userType,
      },
      omit: {
        password: true,
      },
    });
  }
  async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }
  generateEmailVerificationToken(userId: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.prisma.emailVerificationToken.create({
        data: {
          userId: userId,
          token: this.hashService.generateRandomToken(),
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  async findUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  }
  async findAllUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });
    return users;
  }
  async updateUser(id: string, data: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
    return user;
  }
  async deleteUser(id: string) {
    const user = await this.prisma.user.delete({
      where: {
        id,
      },
    });
    return user;
  }
}
