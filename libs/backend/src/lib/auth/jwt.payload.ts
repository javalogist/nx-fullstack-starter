import { Roles } from "@kodevy-core-2.0/shared";

export type JwtPayload = {
    sub: string;      // user ID
    email: string;
    roles: Roles[]; 
    name?: string;    // optional
  };