import { SetMetadata } from '@nestjs/common';
import { Role } from '@kodevy-core-2.0/shared';
import { ROLES_KEY } from '../constants/auth.constants';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles); 