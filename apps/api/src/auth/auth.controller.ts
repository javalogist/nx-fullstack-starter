import { CurrentUser, GoogleAuthGuard, LocalAuthGuard, Public } from "@kodevy-core-2.0/backend";
import { Body, Controller, Post, UseGuards, Get, Query, Res } from "@nestjs/common";
import { LoginDto } from "./login.dto";
import { AuthService } from "./auth.service";
import { CreateUserDto, SuperAdminRegisterDto } from "../user/dtos/user.dto";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from "../user/schemas/user.schema";
import { plainToInstance } from "class-transformer";
import { BaseController } from "@kodevy-core-2.0/backend";
import { FastifyReply } from 'fastify';

@Public()
@ApiTags('Auth')
@Controller('auth')
export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }


  @Post('super-admin-register')
  @ApiOperation({ summary: 'Register a new super admin' })
  @ApiQuery({ name: 'dto', required: true, description: 'Super admin registration data' })
  @ApiResponse({ status: 201, description: 'Super admin registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Invalid registration token' })
  async superAdminRegister(@Body() userDto: SuperAdminRegisterDto): Promise<any> {
    const user = plainToInstance(User, userDto);
    await this.authService.registerSuperAdmin(user, userDto.registrationToken);
    return {
      data: null,
      message: 'Super admin registered successfully',
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiQuery({ name: 'credentials', required: true, description: 'Login credentials' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(LocalAuthGuard)
  async login(
    @Body() credentials: LoginDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const user = await this.authService.validateUser(
      credentials.email,
      credentials.password
    );
    const token = await this.authService.generateToken(user);
    res.header('Authorization', `Bearer ${token}`);
    return this.success(token, 'User logged in successfully');
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Redirect to Google login
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@CurrentUser() user: User, @Res({ passthrough: true }) res: FastifyReply,) {
    const token = await this.authService.generateToken(user);
    res.header('Authorization', `Bearer ${token}`);
    return this.success(token, 'User logged in successfully');
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiQuery({ name: 'dto', required: true, description: 'User registration data' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async register(@Body() dto: CreateUserDto) {
    await this.authService.registerUser(
      dto
    );
    return this.success(null, 'User registered successfully. Please check your email for verification.');
  }

  @Get('verify-email')
  @ApiOperation({ summary: 'Verify user email address' })
  @ApiQuery({ name: 'token', required: true, description: 'Email verification token' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  async verifyEmail(@Query('token') token: string, @Res({ passthrough: true }) res: FastifyReply) {
    const accessToken = await this.authService.verifyEmail(token);
    res.header('Authorization', `Bearer ${accessToken}`);
    return this.success(null, 'Email verified successfully');

  }

  @Get('resend-verification')
  @ApiOperation({ summary: 'Resend verification email' })
  @ApiResponse({ status: 200, description: 'Verification email sent successfully' })
  @ApiResponse({ status: 200, description: 'User not found or already verified' })
  async resendVerificationEmail(@Query('email') email: string) {
    await this.authService.resendVerificationEmail(email);
    return this.success(null, 'Verification email sent successfully');
  }

  // @Post('forgot-password')
  // @ApiOperation({ summary: 'Forgot user password' })
  // @ApiQuery({ name: 'dto', required: true, description: 'Forgot password data' })
  // @ApiResponse({ status: 200, description: 'Forgot password successfully' })
  // @ApiResponse({ status: 400, description: 'Bad request' })
  // async changePassword(@Body() dto: ChangePasswordDto) {
  //   return this.authService.changePassword(dto);
  // }
}
