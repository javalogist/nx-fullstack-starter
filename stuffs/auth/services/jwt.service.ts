import { Injectable } from "@nestjs/common";
import { JwtService as NestJwtService } from "@nestjs/jwt";
import { JwtPayload } from "../types/jwt.payload";

@Injectable()
export class JwtService {

  constructor(private readonly jwtService: NestJwtService) { }

  generateToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  decodeToken(token: string): JwtPayload {
    return this.jwtService.decode(token) as JwtPayload;
  }

  validateToken(token: string): JwtPayload {
    return this.jwtService.verify(token) as JwtPayload;
  }
}
