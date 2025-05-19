import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IGoogleAuthService } from '../interfaces/auth.interface';
import { IBaseUser } from '@kodevy-core-2.0/shared';
import { IUserService } from '../../user/interfaces/user-service.interface';
import { GOOGLE_SCOPES } from '../constants/auth.constants';
import { OAuth2Client } from 'google-auth-library';

interface GoogleUserPayload {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

@Injectable()
export class GoogleAuthService implements IGoogleAuthService {
  private readonly oauth2Client: OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: IUserService<IBaseUser>,
  ) {
    this.oauth2Client = new OAuth2Client(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
      this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
      this.configService.get<string>('GOOGLE_CALLBACK_URL'),
    );
  }

  generateGoogleAuthUrl(): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: GOOGLE_SCOPES,
    });
  }

  async validateGoogleToken(token: string): Promise<IBaseUser | null> {
    try {
      const ticket = await this.oauth2Client.verifyIdToken({
        idToken: token,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload() as GoogleUserPayload;
      if (!payload) {
        return null;
      }

      let user = await this.userService.findByEmail(payload.email);
      if (!user) {
        // Create new user if doesn't exist
        user = await this.userService.create({
          email: payload.email,
          password: '', // Google users don't need a password
          roles: ['user'],
          loginType: 'google'
        });
      }

      return user;
    } catch (error) {
      return null;
    }
  }

  async handleGoogleCallback(code: string): Promise<IBaseUser> {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);

    const ticket = await this.oauth2Client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
    });

    const payload = ticket.getPayload() as GoogleUserPayload;
    if (!payload) {
      throw new Error('Invalid Google token payload');
    }

    let user = await this.userService.findByEmail(payload.email);
    if (!user) {
      // Create new user if doesn't exist
      user = await this.userService.create({
        email: payload.email,
        password: '', // Google users don't need a password
        roles: ['user'],
        loginType: 'google'
      });
    }

    return user;
  }
} 