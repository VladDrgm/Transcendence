import { NestFactory } from '@nestjs/core';
import { NestApplication } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001', // frontend url
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT);
  console.log('Server is running on port ' + process.env.PORT + '.');
  console.log('Access the app at http://localhost:' + process.env.PORT + '/');
}
bootstrap();
