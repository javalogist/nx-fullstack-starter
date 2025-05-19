import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { IBaseUser } from '@kodevy-core-2.0/shared';
@Injectable()
export class JwtService {
  constructor(private jwtService: NestJwtService) {}

  async sign(user: IBaseUser): Promise<string> {
    return this.jwtService.signAsync({ sub: user.id });
  }

  async verify(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token);
  }
}
