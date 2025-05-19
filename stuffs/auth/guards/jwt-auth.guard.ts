import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Inject } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @Inject('GUARD_VALIDATOR')
    private readonly guardValidator: { validateGuard: (guard: any) => void }
  ) {
    super();
    // Validate that JWT strategy is configured
    this.guardValidator.validateGuard(JwtAuthGuard);
  }

  override canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}