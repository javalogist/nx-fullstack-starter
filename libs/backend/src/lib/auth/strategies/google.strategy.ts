import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject } from '@nestjs/common';
import { Strategy, StrategyOptions, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { IAuthService } from '../interfaces/auth-service.interface';
import { GoogleOAuthPayload } from '../../types/google-oauth.payload';
import { OAuthProvider, GOOGLE_STRATEGY } from '../constants/auth.constants';
import { AUTH_SERVICE_TOKEN } from '../constants';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy,GOOGLE_STRATEGY) {
  constructor(
    configService: ConfigService,
    @Inject(AUTH_SERVICE_TOKEN) private authService: IAuthService
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
      accessType: 'offline',
    } as StrategyOptions);
  }

   // Override authorizationParams to force prompt
  override authorizationParams() {
    return {
      prompt: 'consent select_account', // force consent & account chooser
      access_type: 'offline',           // ensure offline for refresh token
    };
  }


  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ): Promise<any> {
    const googlePayload: GoogleOAuthPayload = {...profile._json,accessToken,refreshToken};
    const user = await this.authService.findOrCreateOAuthUser(OAuthProvider.GOOGLE, googlePayload);
    done(null, user);
  }
}
