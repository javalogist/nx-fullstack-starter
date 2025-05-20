import { SetMetadata } from '@nestjs/common';
import { Role } from '@kodevy-core-2.0/shared';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles); 