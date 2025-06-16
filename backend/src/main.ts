/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.enableCors();

  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .addGlobalResponse({
      status: 500,
      description: 'Internal server error',
    })
    .setTitle('Elton Fintech API')
    .setDescription('Dev: Elton Marques')
    .setVersion('1.0')
    .addTag('users')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);
  await app.listen(process.env.APP_PORT ?? 6002);
}
bootstrap();
