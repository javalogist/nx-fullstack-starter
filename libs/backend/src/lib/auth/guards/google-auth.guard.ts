import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Inject } from '@nestjs/common';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {}