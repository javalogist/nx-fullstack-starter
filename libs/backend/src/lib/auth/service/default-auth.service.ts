import { Injectable, NotImplementedException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IBaseUser } from '@kodevy-core-2.0/shared';
import { IUserService } from '../../user/user-service.interface';
import { IAuthService } from '../interfaces/auth-service.interface';
import { AccessTokenPayload } from '../../types/access-token.payload';
import { LoginType } from '@kodevy-core-2.0/shared';
import { OAuthProvider } from '../constants/auth.constants';
import { GoogleOAuthPayload } from '../../types/google-oauth.payload';
@Injectable()
export class DefaultAuthService implements IAuthService {
  constructor(
    protected readonly jwtService: JwtService,
    protected readonly userService: IUserService,
  ) { }
  async registerUser(email: string, password: string): Promise<IBaseUser> {
    const user = await this.userService.findByEmail(email);
    if (user) {
      throw new UnauthorizedException('User already exists');
    }
    const newUser = await this.userService.create({
      email,
      password,
      loginType: LoginType.LOCAL,
      isEmailVerified: false,
      roles: ['user'],
    });
    return newUser;
  }

  //Used by jwt strategy to find the user
  async findById(id: string): Promise<IBaseUser> {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  //used by local strategy to validate the user
  async validateUser(email: string, password: string): Promise<IBaseUser> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (await this.userService.validatePassword(user, password)) {
      if (!user.isEmailVerified) {
        throw new UnauthorizedException('Email not verified');
      }
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  //used by controller to generate the token
  async generateToken(user: IBaseUser): Promise<string> {
    const payload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
    };
    return this.jwtService.signAsync(payload);
  }

  //used by google strategy to find or create the user
  async findOrCreateOAuthUser(provider: OAuthProvider, profile: Record<string, any>): Promise<IBaseUser> {
    if (provider === OAuthProvider.GOOGLE) {
      profile = profile as GoogleOAuthPayload;

      const user = await this.userService.findByEmail(profile['emails'][0]?.value);
      if (user) {
        return user;
      }
      return await this.userService.create({
        email: profile['emails'][0]?.value,
        password: '',
        firstName: profile['name']?.givenName,
        lastName: profile['name']?.familyName,
        profilePicture: profile['photos'][0]?.value,
        loginType: LoginType.GOOGLE,
        isEmailVerified: true,
        roles: ['user'],
      });
    }
    throw new NotImplementedException(`OAuth provider ${provider} not implemented`);
  }

}
