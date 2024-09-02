import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Excel = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return {
      file: request?.file,
    };
  },
);
