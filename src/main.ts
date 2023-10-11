import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      `${process.env.CLIENT}`,
      'http://localhost:3000',
      // Thêm các nguồn gốc khác tại đây
    ], // Thay đổi thành nguồn gốc của ứng dụng web của bạn
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Nếu bạn cần chia sẻ cookie hoặc thông tin xác thực qua CORS
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  )
  await app.listen(process.env.PORT || 8800);
}
bootstrap();
