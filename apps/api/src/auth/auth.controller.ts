import {CurrentUser, GoogleAuthGuard, LocalAuthGuard, Public } from "@kodevy-core-2.0/backend";
import { Body, Controller, Post, UseGuards, Get, Query } from "@nestjs/common";
import { LoginDto } from "./login.dto";
import { AuthService } from "./auth.service";
import { CreateUserDto, SuperAdminRegisterDto } from "../user/dtos/user.dto";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from "../user/schemas/user.schema";
import { plainToInstance } from "class-transformer";

@Public()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('super-admin-register')
  @ApiOperation({ summary: 'Register a new super admin' })
  @ApiQuery({ name: 'dto', required: true, description: 'Super admin registration data' })
  @ApiResponse({ status: 201, description: 'Super admin registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Invalid registration token' })
  async superAdminRegister(@Body() userDto: SuperAdminRegisterDto): Promise<User> {
   const user = plainToInstance(User, userDto);
   return this.authService.registerSuperAdmin(user, userDto.registrationToken);
  }
  
    @Post('login')
    @ApiOperation({ summary: 'Login user' })
    @ApiQuery({ name: 'credentials', required: true, description: 'Login credentials' })
    @ApiResponse({ status: 200, description: 'User logged in successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @UseGuards(LocalAuthGuard)
    async login(@Body() credentials: LoginDto) {
      const user = await this.authService.validateUser(
        credentials.email,
        credentials.password
      );
      const token = await this.authService.generateToken(user);
      return { user, token };
    }

    @Get('google')
    @UseGuards(GoogleAuthGuard)
    async googleAuth() {
      // Redirect to Google login
    }
  
    @Get('google/redirect')
    @UseGuards(GoogleAuthGuard)
    async googleAuthRedirect(@CurrentUser() user: User) {
      const token = await this.authService.generateToken(user);
      return { user, token }; // handle login/registration here
    }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiQuery({ name: 'dto', required: true, description: 'User registration data' })
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async register(@Body() dto: CreateUserDto) {
      const user = await this.authService.registerUser(
        dto
      );
      return {
        data:"User registered",
        message:'User registered successfully. Please check your email for verification.',
      };
    }

    @Get('verify-email')
    @ApiOperation({ summary: 'Verify user email address' })
    @ApiQuery({ name: 'token', required: true, description: 'Email verification token' })
    @ApiResponse({ status: 200, description: 'Email verified successfully' })
    @ApiResponse({ status: 401, description: 'Invalid or expired token' })
    async verifyEmail(@Query('token') token: string) {
      return this.authService.verifyEmail(token);
    }

    @Get('resend-verification')
    @ApiOperation({ summary: 'Resend verification email' })
    @ApiResponse({ status: 200, description: 'Verification email sent successfully' })
    @ApiResponse({ status: 200, description: 'User not found or already verified' })
    async resendVerificationEmail(@Query('email') email: string) {
      return this.authService.resendVerificationEmail(email);
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
