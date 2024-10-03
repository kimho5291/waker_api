import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  
  const swaggerOption = new DocumentBuilder()
  .setTitle('Waker API Docs')
  .setDescription('Waker API 정의서')
  .setVersion('1.0.0')
  .build();
  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, swaggerOption));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  
  
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
