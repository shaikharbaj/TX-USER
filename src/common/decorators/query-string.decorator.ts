import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const QueryString = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request;
  },
);
