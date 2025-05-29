import { BusinessLogicException, IAuthService, MailerService, OAuthProvider, AccessTokenPayload, GoogleOAuthPayload, comparePassword, AuthCodeCacheService } from "@nx-fullstack-starter/backend";
import { Injectable, NotImplementedException, PreconditionFailedException, Scope, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginType, Role } from "@nx-fullstack-starter/shared";
import { CreateUserDto } from "../user/dtos/user.dto";
import { User } from "../user/schemas/user.schema";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../user/user.service";

@Injectable({scope: Scope.DEFAULT})
export class AuthService implements IAuthService<User> {
  private readonly VERIFICATION_TOKEN_EXPIRY = '24h';
  private readonly VERIFICATION_TOKEN_TYPE = 'email-verification';
  private readonly FRONTEND_EMAIL_VERIFY_CALLBACK_URL = this.configService.get<string>('FRONTEND_EMAIL_VERIFY_CALLBACK_URL');
  private readonly FRONTEND_AUTH_CALLBACK_URL = this.configService.get<string>('FRONTEND_AUTH_CALLBACK_URL');

  constructor(
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly authCodeCacheService: AuthCodeCacheService
  ) {}

  //Used by JwtAuthStrategy
  async findById(id: string): Promise<User> {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  //Used by LocalAuthStrategy
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if(user.loginType === LoginType.GOOGLE){
      throw new BusinessLogicException('You are registereed with google provider, please login with google');
    }
    if (!await comparePassword(password, user.password)) {
      throw new BusinessLogicException('Invalid credentials');
    }
    if (!user.isEmailVerified) {
      throw new BusinessLogicException('Email not verified');
    }
    return user;
  }

  async getAuthCode(userId: string): Promise<string> {
    const code = Math.random().toString(36).substring(2, 15);
    this.authCodeCacheService.setAuthCode(code, userId, 60);
    return code;
  }

  async verifyAuthCode(code: string): Promise<string> {
    const userId = this.authCodeCacheService.getAuthCode(code);
    if (!userId) {
      throw new BusinessLogicException('Invalid auth code');
    }
    const user = await this.userService.findById(userId);
    this.authCodeCacheService.deleteAuthCode(code);
    return await this.generateToken(user);
  }

  async generateToken(user: User): Promise<string> {
    const payload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
    };
    return this.jwtService.signAsync(payload);
  }

  async findOrCreateOAuthUser(provider: OAuthProvider, profile: Record<string, any>): Promise<User> {
    if (provider !== OAuthProvider.GOOGLE) {
      throw new NotImplementedException(`OAuth provider ${provider} not implemented`);
    }

    const googleProfile = profile as GoogleOAuthPayload;
    const existingUser = await this.userService.findByEmail(googleProfile.email);

    if (existingUser) {
      if (existingUser.loginType !== LoginType.GOOGLE) {
        throw new BusinessLogicException("You are already registered with different login type or provider, please login with the same");
      }
      if (existingUser.googleId !== googleProfile.sub) {
        throw new UnauthorizedException('Google account already in use');
      }
      return existingUser;
    }

    return this.userService.create({
      googleId: googleProfile.sub,
      email: googleProfile.email,
      password: '',
      username: await this.userService.getUsername(googleProfile.given_name, googleProfile.family_name),
      firstName: googleProfile.given_name,
      lastName: googleProfile.family_name,
      profilePicture: googleProfile.picture,
      loginType: LoginType.GOOGLE,
      isEmailVerified: googleProfile.email_verified,
      roles: ['user'],
      googleAccessToken: googleProfile.accessToken,
      googleRefreshToken: googleProfile.refreshToken,
    });
  }

  async registerUser(dto: CreateUserDto): Promise<User> {
    const userData = {
      email: dto.email,
      password: dto.password,
      firstName: dto.firstName,
      lastName: dto.lastName,
      profilePicture: dto.profilePicture,
      loginType: LoginType.LOCAL,
      isEmailVerified: false,
    };

    const verificationToken = this.generateVerificationToken(userData.email);
    const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await this.userService.create({
      ...userData,
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpiresAt: expiryDate,
    });

    this.sendVerificationEmail(user, verificationToken);
    return user;
  }

  async verifyEmail(token: string): Promise<string> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('VERIFICATION_SECRET')
      });

      if (payload.type !== this.VERIFICATION_TOKEN_TYPE) {
        throw new UnauthorizedException('Invalid verification token');
      }

      const user = await this.userService.findByEmail(payload.email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (user.emailVerificationToken !== token || 
          new Date() > user.emailVerificationTokenExpiresAt) {
        throw new UnauthorizedException('Token expired or invalid');
      }

      await this.userService.update(user.id.toString(), {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationTokenExpiresAt: null
      });

      return this.getAuthCode(user.id);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid verification token');
    }
  }

  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BusinessLogicException('User not found for sending verification email');
    }

    if (user.isEmailVerified) {
      throw new BusinessLogicException('Email is already verified');
    }

    const verificationToken = this.generateVerificationToken(user.email);
    await this.userService.update(user.id.toString(), {
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    this.sendVerificationEmail(user, verificationToken);
    return { message: 'Verification email sent successfully' };
  }

  async registerSuperAdmin(user: Partial<User>, registrationToken: string): Promise<User> {
    if (registrationToken !== this.configService.get('SUPER_ADMIN_REGISTRATION_TOKEN')) {
      throw new UnauthorizedException('Invalid registration token');
    }
    return this.userService.create({
      ...user,
      roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.USER],
      isEmailVerified: true
    });
  }

  private generateVerificationToken(email: string): string {
    return this.jwtService.sign(
      { email, type: this.VERIFICATION_TOKEN_TYPE },
      { 
        secret: this.configService.get('VERIFICATION_SECRET'),
        expiresIn: this.VERIFICATION_TOKEN_EXPIRY
      }
    );
  }

  private async sendVerificationEmail(user: User, token: string): Promise<void> {
    const frontendUrl = this.FRONTEND_EMAIL_VERIFY_CALLBACK_URL;
    if (!frontendUrl) {
      throw new PreconditionFailedException('Frontend auth callback URL is not set');
    }

    const verificationLink = `${frontendUrl}?token=${token}`;
    await this.mailService.send({
      to: user.email,
      subject: 'Verify your email',
      template: 'verifyEmail',
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        appName: this.configService.get('APP_NAME', 'Our App'),
        verificationLink: verificationLink,
      },
    });
  }

  async getAuthRedirectUrl(code: string): Promise<string> {
    return `${this.FRONTEND_AUTH_CALLBACK_URL}?code=${code}`;
  }
}

