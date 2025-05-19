import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserService } from '../../user/interfaces/user-service.interface';
import { IAuthService } from '../interfaces/auth.interface';
import { IBaseUser } from '@kodevy-core-2.0/shared';
import { JwtService } from './jwt.service';
import { JwtPayload } from '../types/jwt.payload';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userService: IUserService<IBaseUser>,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<IBaseUser | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await this.userService.validatePassword(user, password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  generateToken(user: IBaseUser): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      loginType: user.loginType
    };
    return this.jwtService.generateToken(payload);
  }

  validateToken(token: string): JwtPayload {
    try {
      return this.jwtService.validateToken(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  refreshToken(token: string): string {
    const payload = this.jwtService.validateToken(token);
    return this.jwtService.generateToken({
      sub: payload.sub,
      email: payload.email,
      roles: payload.roles,
      loginType: payload.loginType
    });
  }
} 