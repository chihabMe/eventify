import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { ConsoleLogger } from '@nestjs/common';
import { CustomBadRequestExceptionFilter } from './common/filters/custom-badrequest.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      colors: true,
      timestamp: true,
    }),
  });

  app.setGlobalPrefix('api');
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

  patchNestJsSwagger();
  const config = new DocumentBuilder()
    .setTitle('Eventify a smart event booking system')
    .setDescription('Eventify API description')
    .setVersion('1.0')
    .addTag('Eventify')
    .addCookieAuth('access_token', {
      type: 'http',
      scheme: 'bearer',
      description: 'Access token',
      name: 'access_token',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      withCredentials: true,
    },
  });

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
