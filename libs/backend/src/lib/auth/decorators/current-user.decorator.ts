import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IBaseUser } from '@nx-fullstack-starter/shared';

export const CurrentUser = createParamDecorator(
  (data: keyof IBaseUser | undefined, ctx: ExecutionContext): IBaseUser | any => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
); 