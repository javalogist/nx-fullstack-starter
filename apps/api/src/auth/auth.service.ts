import { BusinessLogicException, IAuthService, MailerService, OAuthProvider,AccessTokenPayload, GoogleOAuthPayload, comparePassword, toModel} from "@kodevy-core-2.0/backend";
import {  Injectable, NotImplementedException, Scope, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginType, Role, UserModel } from "@kodevy-core-2.0/shared";
import { CreateUserDto } from "../user/dtos/user.dto";
import { User, UserDocument } from "../user/schemas/user.schema";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../user/user.service";

@Injectable({scope: Scope.DEFAULT})
export class AuthService implements IAuthService<User> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if(await comparePassword(password,user.password)){
      if(!user.isEmailVerified){
        throw new UnauthorizedException('Email not verified');
      }
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async generateToken(user: User): Promise<string> {
    const payload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
    };
    return this.jwtService.signAsync(payload);
  }

  async findOrCreateOAuthUser(provider: OAuthProvider, profile: Record<string, any>): Promise<User> {
    if (provider === OAuthProvider.GOOGLE) {
      const googleProfile = profile as GoogleOAuthPayload;

      const user = await this.userService.findByEmail(googleProfile.email);
      if (user ) {
        if(user.loginType === LoginType.GOOGLE){
          if(user.googleId !== googleProfile.sub){
            throw new UnauthorizedException('Google account already in use');
          }
        }
        else throw new BusinessLogicException("You are already registered with different login type or provider, please login with the same");
        return user;
      }
     
    
      return await this.userService.create({
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
      } as Partial<User>);
    }
    throw new NotImplementedException(`OAuth provider ${provider} not implemented`);
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

    
     this.mailService.send({
      to: user.email,
      subject: 'Verify your email',
      template: 'verifyEmail',
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        appName: this.configService.get('APP_NAME', 'Our App'),
        verificationLink: `${dto.callbackUrl}?token=${verificationToken}`,
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

  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    // Find user by email
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BusinessLogicException('User not found');
    }

    // Check if user is already verified
    if (user.isEmailVerified) {
      throw new BusinessLogicException('Email is already verified');
    }

    // Generate new verification token
    const verificationToken = this.jwtService.sign(
      { email: user.email, type: 'email-verification' },
      { 
        secret: this.configService.get('VERIFICATION_SECRET'),
        expiresIn: '24h'
      }
    );

    // Update user with new verification token
    await this.userService.update(user.id.toString(), {
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // Send new verification email
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'Frontend');
     this.mailService.send({
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

    return { message: 'Verification email sent successfully' };
  }

  async registerSuperAdmin(user:Partial<User>, registrationToken:string): Promise<User> {
    if(registrationToken !== this.configService.get('SUPER_ADMIN_REGISTRATION_TOKEN')){
      throw new UnauthorizedException('Invalid registration token');
    }
    const adminUser = {...user, roles: [Role.SUPER_ADMIN,Role.ADMIN, Role.USER], isEmailVerified: true};
    return this.userService.create(adminUser);
  }
}

