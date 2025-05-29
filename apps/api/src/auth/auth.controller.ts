import { CurrentUser, CustomRedirect, GoogleAuthGuard, LocalAuthGuard, Public } from "@nx-fullstack-starter/backend";
import { Body, Controller, Post, UseGuards, Get, Query, Res, Param } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto, SuperAdminRegisterDto } from "../user/dtos/user.dto";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from "../user/schemas/user.schema";
import { plainToInstance } from "class-transformer";
import { BaseController } from "@nx-fullstack-starter/backend";
import { FastifyReply } from 'fastify';

@Public()
@ApiTags('Auth')
@Controller('auth')
export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }


  //This can be a exception route, since its used only by super-admin for its own registration. 
  @Post('super-admin-register')
  @ApiOperation({ summary: 'Register a new super admin' })
  @ApiQuery({ name: 'dto', required: true, description: 'Super admin registration data' })
  @ApiResponse({ status: 201, description: 'Super admin registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Invalid registration token' })
  async superAdminRegister(@Body() userDto: SuperAdminRegisterDto): Promise<any> {
    const user = plainToInstance(User, userDto);
    await this.authService.registerSuperAdmin(user, userDto.registrationToken);
    return this.success(null, 'Super admin registered successfully');
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiQuery({ name: 'mode', required: false, description: 'Response mode: "redirect" or "json"' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser('id') userId: string
  ) {
    const authCode = await this.authService.getAuthCode(userId);
    //const redirectUrl = await this.authService.getRedirectUrl('code', authCode);
    return this.success(authCode, 'Exchange this code for an access token');
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
    const authCode = await this.authService.verifyEmail(token);
    return this.success(authCode, 'Email verified successfully. Exchange this code for an access token');
  }

  @Get('resend-verification-email')
  @ApiOperation({ summary: 'Resend verification email' })
  @ApiResponse({ status: 200, description: 'Verification email sent successfully' })
  @ApiResponse({ status: 200, description: 'User not found or already verified' })
  async resendVerificationEmail(@Query('email') email: string) {
    await this.authService.resendVerificationEmail(email);
    return this.success(null, 'Verification email sent successfully');
  }

  @Get('exchange-auth-code')
  @ApiOperation({ summary: 'Exchange auth code for an access token' })
  @ApiQuery({ name: 'code', required: true, description: 'Auth code' })
  @ApiResponse({ status: 200, description: 'Access token exchanged successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async exchangeAuthCode(@Query('code') authCode: string) {
    const accessToken = await this.authService.verifyAuthCode(authCode);
    return this.success(accessToken, 'Access token exchanged successfully');
  }


  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Redirect to Google login
  }

  @CustomRedirect()
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@CurrentUser() user: User, @Res({ passthrough: false }) res: FastifyReply,) {
    const authCode = await this.authService.getAuthCode(user.id);
    const redirectUrl = await this.authService.getAuthRedirectUrl(authCode);
    res.redirect(redirectUrl);
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
