import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true
  });
  const PORT = process.env.PORT || 4000
  await app.listen(PORT).then(() => {
    console.log(`App running on port ${PORT}`);
  }).catch((err) => {
    console.log(err);
  })
}
bootstrap();
