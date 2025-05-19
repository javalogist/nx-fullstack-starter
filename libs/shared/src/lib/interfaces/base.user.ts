import { LoginType } from "../types/login-type";

export interface IBaseUser {
    id: string;
    email: string;
    password: string;
    name:string;
    username?: string|null;
    roles: string[];
    loginType: LoginType;
    createdAt: Date;
    updatedAt: Date;
}