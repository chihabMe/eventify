import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
import { ConfigModule } from '@nestjs/config';
// import { RolesGuard } from './common/guard/roles.guard';
import { EventsModule } from './events/events.module';
import { StorageService } from './storage/storage.service';
import { BookingsController } from './bookings/bookings.controller';
import { BookingsModule } from './bookings/bookings.module';
import { BookingsService } from './bookings/bookings.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ControllerModule,
    EventsModule,
    BookingsModule,
  ],
  controllers: [AppController, BookingsController],
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
    StorageService,
    BookingsService,
  ],
})
export class AppModule {}
