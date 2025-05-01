import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { ConsoleLogger } from '@nestjs/common';

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
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     transform: true,

  //   }),
  // );
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
