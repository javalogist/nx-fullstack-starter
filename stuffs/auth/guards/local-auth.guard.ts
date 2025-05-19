import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Inject } from '@nestjs/common';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(
    @Inject('GUARD_VALIDATOR')
    private readonly guardValidator: { validateGuard: (guard: any) => void }
  ) {
    super();
    // Validate that Local strategy is configured
    this.guardValidator.validateGuard(LocalAuthGuard);
  }

  override canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}