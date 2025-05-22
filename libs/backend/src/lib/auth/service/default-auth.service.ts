import { Inject, Injectable, NotImplementedException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IBaseUser } from '@kodevy-core-2.0/shared';
import { IUserService } from '../../user/user-service.interface';
import { IAuthService } from '../interfaces/auth-service.interface';
import { AccessTokenPayload } from '../../types/access-token.payload';
import { LoginType } from '@kodevy-core-2.0/shared';
import { DEFAULT_JWT_EXPIRES_IN, OAuthProvider, USER_SERVICE_TOKEN } from '../constants/auth.constants';
import { GoogleOAuthPayload } from '../../types/google-oauth.payload';
@Injectable()
export class DefaultAuthService implements IAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: IUserService,
    private readonly configService: ConfigService
  ) {}

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
    if(!user){
      throw new UnauthorizedException('User not found');
    }
    if (await this.userService.validatePassword(user, password)) {
      if(!user.isEmailVerified){
        throw new UnauthorizedException('Email not verified');
      }
      return user;
    }
   throw new UnauthorizedException('Invalid credentials');
  }

  //used by controller to generate the token
  async generateToken(user: IBaseUser): Promise<string> {
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN', DEFAULT_JWT_EXPIRES_IN);
    const now = Math.floor(Date.now() / 1000);
    
    const payload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
    };
    return this.jwtService.signAsync(payload);
  }

  //used by google strategy to find or create the user
  async findOrCreateOAuthUser(provider: OAuthProvider, profile: Record<string, any>): Promise<IBaseUser> {
    if(provider === OAuthProvider.GOOGLE){
      profile = profile as GoogleOAuthPayload;
    
    const user = await this.userService.findByEmail(profile['emails'][0]?.value);
    if (user) {
      return user;
    }
    return  await this.userService.create({
      email: profile['emails'][0]?.value,
      password:'',
      firstName: profile['name']?.givenName,
      lastName: profile['name']?.familyName,
      profilePicture: profile['photos'][0]?.value,
      loginType:LoginType.GOOGLE,
      isEmailVerified:true,
      roles:['user'],
    });
  }
  throw new NotImplementedException(`OAuth provider ${provider} not implemented`);
  }

  //used by generateToken to parse the expiration time
  private parseExpirationTime(expiresIn: string): number {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1), 10);

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 60 * 60 * 24;
      default:
        return 15 * 60; // Default to 15 minutes if invalid format
    }
  }
}
