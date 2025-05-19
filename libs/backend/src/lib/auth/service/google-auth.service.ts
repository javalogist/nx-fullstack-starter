import { Injectable } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { ConfigService } from '@nestjs/config';
import { IUserService } from '../../user/user-service.interface';
import { IBaseUser } from '@kodevy-core-2.0/shared';


@Injectable()
export class GoogleAuthService {
  constructor(
    private config: ConfigService,
    private jwtService: JwtService
  ) {}

  async handleLogin(user: IBaseUser): Promise<{ accessToken: string }> {
    return {
      accessToken: await this.jwtService.sign(user),
    };
  }
}
