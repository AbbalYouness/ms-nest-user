import { NestFactory } from '@nestjs/core';
import { Transport, RmqOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  await app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get('RABBITMQ_HOST_URL')],
      queue: configService.get('RABBITMQ_USER_QUEUE_NAME'),
      queueOptions: {
        durable: true,
      },
    },
  } as RmqOptions);

  await app.startAllMicroservicesAsync();
}
bootstrap();
