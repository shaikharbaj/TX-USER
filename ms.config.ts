import { SELF_REGISTRY_TCP } from "src/constant/tcp.registry";
import { SELF_REGISTRY_KAFKA } from "src/constant/kafka.registry";

export const MS_CONFIG = {
    transport: process.env.USER_MICROSERVICE_TRANSPORT,
    TCP: SELF_REGISTRY_TCP,
    KAFKA: SELF_REGISTRY_KAFKA,
    REDIS: {},
    RABBITMQ: {}
};