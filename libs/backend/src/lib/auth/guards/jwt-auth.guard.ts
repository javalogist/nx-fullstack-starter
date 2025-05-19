import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  overridecanActivate(context: ExecutionContext) {
    // Add custom logic if needed (e.g., roles, tenant check, etc.)
    return super.canActivate(context);
  }
}
