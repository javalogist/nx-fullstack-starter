import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { IUserService } from '../../user/interfaces/user-service.interface';
import { IBaseUser } from '@kodevy-core-2.0/shared';

@Injectable()
export class LocalStrategy<T extends IBaseUser> extends PassportStrategy(Strategy) {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: IUserService<T>
  ) {
    super({
      usernameField: 'email', // We'll use email as the username field
    });
  }

  async validate(email: string, password: string): Promise<T> {
    const user = await this.userService.findByEmail(email);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.userService.validatePassword(user, password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
} 