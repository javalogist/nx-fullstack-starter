import { AUTH_SERVICE_TOKEN, IAuthService, LocalAuthGuard, Public } from "@kodevy-core-2.0/backend";
import { Body, Controller, Inject, Post, UnauthorizedException, UseGuards } from "@nestjs/common";
import { LoginDto } from "./login.dto";
import { AuthService } from "./auth.service";

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

}
