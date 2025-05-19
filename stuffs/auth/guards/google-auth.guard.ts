import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Inject } from '@nestjs/common';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor(
    @Inject('GUARD_VALIDATOR')
    private readonly guardValidator: { validateGuard: (guard: any) => void }
  ) {
    super();
    // Validate that Google strategy is configured
    this.guardValidator.validateGuard(GoogleAuthGuard);
  }

  override canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}