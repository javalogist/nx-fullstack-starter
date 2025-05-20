import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IBaseUser } from '@kodevy-core-2.0/shared';

export const CurrentUser = createParamDecorator(
  (data: keyof IBaseUser | undefined, ctx: ExecutionContext): IBaseUser | any => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
); 