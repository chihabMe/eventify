import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { ConsoleLogger } from '@nestjs/common';
import { CustomBadRequestExceptionFilter } from './common/filters/custom-badrequest.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      colors: true,
      timestamp: true,
    }),
  });
  app.use(helmet());
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });
  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalFilters(new CustomBadRequestExceptionFilter());

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
