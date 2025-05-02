import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { PrismaService } from './prisma.service';
import { PrismaModule } from './prisma.module';
import { APP_GUARD, APP_PIPE, Reflector } from '@nestjs/core';
import { CustomZodValidationPipe } from './common/pipes/custom-zod-validation.pipe';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ControllerModule } from './controller/controller.module';
import { EmailService } from './email/email.service';
import { AuthGuard } from './common/guard/auth.guard';
import { RolesGuard } from './common/guard/roles.guard';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { HashService } from './auth/hash/hash.service';
// import { RolesGuard } from './common/guard/roles.guard';

@Module({
  imports: [
    BooksModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    ControllerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    AuthService,
    Reflector,
    UsersService,
    HashService,

    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_PIPE,
      useClass: CustomZodValidationPipe,
    },
    EmailService,
  ],
})
export class AppModule {}
