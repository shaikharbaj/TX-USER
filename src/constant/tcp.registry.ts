import { Transport } from '@nestjs/microservices';

const myTransport: Transport = Transport.TCP;

export const SELF_REGISTRY_TCP = {
  transport: myTransport,
  options: {
    host: '0.0.0.0',
    port: parseInt(process.env.USER_MICROSERVICE_PORT),
  },
};

export const PRODUCT_MICROSERVICE_TCP_REGISTRY = {
  name: 'PRODUCT_MICROSERVICE',
  options: {
    host: '0.0.0.0',
    port: parseInt(process.env.PRODUCT_MICROSERVICE_PORT),
  },
};

export const NOTIFICATION_MICROSERVICE_TCP_REGISTRY = {
  transport: myTransport,
  name: "NOTIFICATION_MICROSERVICE",
  options: {
    host: "0.0.0.0",
    port: parseInt(process.env.NOTIFICATION_MICROSERVICE_PORT),
  },
};
