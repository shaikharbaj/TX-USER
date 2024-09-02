import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const PageSize = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request?.page_size;
  },
);