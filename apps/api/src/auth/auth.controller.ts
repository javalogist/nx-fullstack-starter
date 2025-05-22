import { AUTH_SERVICE_TOKEN, IAuthService, LocalAuthGuard, Public } from "@kodevy-core-2.0/backend";
import { Body, Controller, Inject, Post, UnauthorizedException, UseGuards, Get, Query } from "@nestjs/common";
import { LoginDto } from "./login.dto";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../user/user.dto";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject(AUTH_SERVICE_TOKEN) private readonly authService: AuthService) {}


    @Post('login')
    @Public()
    @UseGuards(LocalAuthGuard)
    async login(@Body() credentials: LoginDto) {
      const user = await this.authService.validateUser(
        credentials.email,
        credentials.password
      );
      if (!user) {
        throw new UnauthorizedException();
      }
      const token = await this.authService.generateToken(user);
      return { user, token };
    }

    @Post('register')
    @Public()
    async register(@Body() dto: CreateUserDto) {
      const user = await this.authService.registerUser(
        dto
      );
      return user;
    }

    @Get('verify-email')
    @Public()
    @ApiOperation({ summary: 'Verify user email address' })
    @ApiQuery({ name: 'token', required: true, description: 'Email verification token' })
    @ApiResponse({ status: 200, description: 'Email verified successfully' })
    @ApiResponse({ status: 400, description: 'Invalid or expired token' })
    async verifyEmail(@Query('token') token: string) {
      return this.authService.verifyEmail(token);
    }
}
