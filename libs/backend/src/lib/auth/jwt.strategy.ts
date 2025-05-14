import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "./jwt.payload";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') as string,
        });
    }

    async validate(payload: JwtPayload): Promise<any> {
        // This method runs automatically if the token is valid
        // The return value here becomes req.user
        return {
            userId: payload.sub,
            email: payload.email,
            roles: payload.roles,
        };
    }
}