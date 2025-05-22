import { NotImplementedException } from "@nestjs/common";
import { LoginType } from "@kodevy-core-2.0/shared";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { IAuthService } from "../interfaces/auth-service.interface";
import { IBaseUser } from "@kodevy-core-2.0/shared";
import { JwtService } from "@nestjs/jwt";
import { IUserService } from "../../user/user-service.interface";
import { AccessTokenPayload } from "../../types/access-token.payload";
import { OAuthProvider } from "../constants/auth.constants";
import { GoogleOAuthPayload } from "../../types/google-oauth.payload";

@Injectable()
export class DefaultAuthService<T extends IBaseUser = IBaseUser> implements IAuthService<T> {
  constructor(
    protected readonly jwtService: JwtService,
    protected readonly userService: IUserService<T>,
  ) {}

  async findById(id: string): Promise<T> {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async validateUser(email: string, password: string): Promise<T> {
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

  async generateToken(user: T): Promise<string> {
    const payload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
    };
    return this.jwtService.signAsync(payload);
  }

  async findOrCreateOAuthUser(provider: OAuthProvider, profile: Record<string, any>): Promise<T> {
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
      } as Partial<T>);
    }
    throw new NotImplementedException(`OAuth provider ${provider} not implemented`);
  }
}
