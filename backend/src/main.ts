import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';
// import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ZodValidationPipe());
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     transform: true,

  //   }),
  // );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
