require('dotenv').config();
import { NestFactory } from '@nestjs/core';
import {
  Transport,
  MicroserviceOptions,
} from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { MS_CONFIG } from 'ms.config';
import { AppModule } from './app.module';

const logger = new Logger('User Microservice');
async function bootstrap() {
  const transport = MS_CONFIG.transport;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    MS_CONFIG[transport]
  );
  await app.listen();
  logger.log(`User microservice is listening at ${transport} Port: ${process.env.PORT} Timezone: ${process.env.TZ}, Current Time: ${new Date().toString()}`);
}
bootstrap();
