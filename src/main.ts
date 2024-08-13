import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableCors({
    origin: [configService.get('CLIENT_URL')],
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
      skipMissingProperties: true,
      validationError: {
        target: true,
        value: true,
      },
    }),
  );
  await app.listen(configService.get('PORT'));
}
bootstrap();
