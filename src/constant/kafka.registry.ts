import { Transport } from "@nestjs/microservices";

//Setting up transport
const myTransport: Transport = Transport.KAFKA;

export const SELF_REGISTRY_KAFKA = {
  transport: myTransport,
  options: {
    client: {
      clientId: "user",
      brokers: [process.env.USER_MICROSERVICE_BROKER],
    },
    consumer: {
      groupId: "user-consumer-main",
    },
  },
};

export const USER_MS_TO_PRODUCT_MICROSERVICE_KAFKA_REGISTRY = {
  name: "PRODUCT_MICROSERVICE",
  transport: myTransport,
  options: {
    client: {
      clientId: "user-ms-to-product-ms",
      brokers: [process.env.PRODUCT_MICROSERVICE_BROKER],
    },
    consumer: {
      groupId: "user-ms-to-product-ms-consumer",
    },
  },
};

export const API_GATEWAY_NOTIFICATION_TO_NOTIFICATION_MICROSERVICE_KAFKA_REGISTRY = {
  name: 'NOTIFICATION_MICROSERVICE',
  transport: myTransport,
  options: {
    client: {
      clientId: 'notification-api-gateway',
      brokers: [process.env.NOTIFICATION_MICROSERVICE_BROKER],
    },
    consumer: {
      groupId: 'notification-api-gateway-consumer',
    },
  },
};