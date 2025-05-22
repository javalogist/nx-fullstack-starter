import { DefaultAuthService, EMAIL_TEMPLATES, IUserService, MailerService, USER_SERVICE_TOKEN } from "@kodevy-core-2.0/backend";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginType } from "@kodevy-core-2.0/shared";
import { CreateUserDto } from "../user/user.dto";
import { User } from "../user/user.schema";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService extends DefaultAuthService<User> {
  constructor(
    protected readonly jwtService: JwtService,
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
    @Inject(USER_SERVICE_TOKEN) userService: IUserService<User>,
  ) {
    super(jwtService, userService);
  }

  async registerUser(dto: CreateUserDto): Promise<User> {
    // Generate verification token
    const verificationToken = this.jwtService.sign(
      { email: dto.email, type: 'email-verification' },
      { 
        secret: this.configService.get('VERIFICATION_SECRET'),
        expiresIn: '24h'
      }
    );

    // Create user with verification token
    const user = await this.userService.create({
      email: dto.email,
      password: dto.password,
      firstName: dto.firstName,
      lastName: dto.lastName,
      profilePicture: dto.profilePicture,
      loginType: LoginType.LOCAL,
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // Send verification email
    const frontendUrl = this.configService.get<string>('FRONTEND_URL','Frontend');
    await this.mailService.send({
      to: user.email,
      subject: 'Verify your email',
      template: 'verifyEmail',
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        appName: this.configService.get('APP_NAME', 'Our App'),
        verificationLink: `${frontendUrl}/verify-email?token=${verificationToken}`,
      },
    });

    return user;
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    try {
      // Verify the token
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('VERIFICATION_SECRET')
      });

      // Check if token is for email verification
      if (payload.type !== 'email-verification') {
        throw new UnauthorizedException('Invalid verification token');
      }

      // Find user by email
      const user = await this.userService.findByEmail(payload.email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Check if token matches and hasn't expired
      if (user.emailVerificationToken !== token || 
          new Date() > user.emailVerificationTokenExpiresAt) {
        throw new UnauthorizedException('Token expired or invalid');
      }

      // Update user verification status
      await this.userService.update(user.id.toString(), {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationTokenExpiresAt: null
      });

      return { message: 'Email verified successfully' };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid verification token');
    }
  }
}

