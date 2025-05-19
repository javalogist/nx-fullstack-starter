import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { IUserService } from '../../user/user-service.interface';
import { IBaseUser } from '@kodevy-core-2.0/shared';
@Injectable()
export class AuthService {
  constructor(
    private userService: IUserService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<IBaseUser> {
    const user = await this.userService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(user: IBaseUser): Promise<{ accessToken: string }> {
    const accessToken = await this.jwtService.sign(user);
    return { accessToken };
  }
}
