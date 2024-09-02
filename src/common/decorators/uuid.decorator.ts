import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Uuid = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request?.uuid ? request.uuid : request;
  },
);