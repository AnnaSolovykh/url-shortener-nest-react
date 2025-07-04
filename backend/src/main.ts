import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost', 'http://localhost:5173'],
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
