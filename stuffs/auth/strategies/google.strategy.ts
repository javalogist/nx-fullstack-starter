import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, StrategyOptions } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { IBaseUser } from '../../user/interfaces/base-user.interface';
import { IUserService } from '../../user/interfaces/user-service.interface';


@Injectable()
export class GoogleStrategy<T extends IBaseUser> extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    @Inject('USER_SERVICE') private readonly userService: IUserService<T>
  ) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
    const callbackURL = configService.get<string>('GOOGLE_CALLBACK_URL');

    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error('Missing Google OAuth configuration');
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    } as StrategyOptions);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };

    // Find or create user
    let dbUser = await this.userService.findByEmail(user.email);
    
    if (!dbUser) {
      // Create new user if doesn't exist
      dbUser = await this.userService.create({
        email: user.email,
        password: '', // We'll set a random password since it's OAuth
        roles: ['user'],
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.picture,
      } as any);
    }

    done(null, dbUser);
  }
} 