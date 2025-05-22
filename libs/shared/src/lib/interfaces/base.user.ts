import { LoginType } from "../types/login-type";

export interface IBaseUser {
    id: string;
    googleId?:string|null;
    email: string;
    isEmailVerified: boolean;
    password: string;
    firstName:string;
    middleName?:string|null;
    lastName:string;
    username?: string|null;
    profilePicture?:string|null;
    roles: string[];
    loginType: LoginType;
    createdAt: Date;
    updatedAt: Date;
}