import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { HashService } from 'src/auth/hash/hash.service';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { Role } from 'generated/prisma';
import { CustomBadRequestException } from 'src/common/exceptions/custom-badrequest.exception';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashService: HashService,
  ) {}
  async createUser({
    data,
    imageUrl,
  }: {
    data: CreateUserDto;
    imageUrl: string;
  }) {
    const { password, userType, ...rest } = data;
    const uniqueEmail = await this.isEmailUnique(rest.email);
    if (!uniqueEmail) {
      throw new CustomBadRequestException({
        message: 'Email already exists',
        errors: [{ field: 'email', message: 'Email already exists' }],
      });
    }
    try {
      const hashedPassword = await this.hashService.hashPassword(password);

      return await this.prisma.user.create({
        data: {
          email: rest.email,
          firstName: rest.firstName,
          imageUrl,
          lastName: rest.lastName,
          password: hashedPassword,
          role: userType,
        },
        omit: {
          password: true,
        },
      });
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Failed to create user. Please try again.',
      );
    }
  }
  async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }

  async isEmailUnique(email: string) {
    const user = await this.findUserByEmail(email);
    return !user;
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

  async findUsersByRole(role: Role) {
    const users = await this.prisma.user.findMany({
      where: {
        role,
      },
    });
    return users;
  }

  async verifyEmail(userId: string, token: string) {
    const emailVerificationToken =
      await this.prisma.emailVerificationToken.findFirst({
        where: {
          token,
          userId,
        },
      });
    if (!emailVerificationToken) {
      return false;
    }
    if (emailVerificationToken.expiresAt < new Date()) {
      return false;
    }
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isActive: true,
        isEmailVerified: true,
      },
    });
    await this.prisma.emailVerificationToken.delete({
      where: {
        id: emailVerificationToken.id,
      },
    });
    return true;
  }
}
