import { LoginType } from "../types/login-type";

export interface IBaseUser {
    id: string;
    googleId?:string|null;
    email: string;
    isEmailVerified: boolean;
    emailVerificationToken?:string|null;
    emailVerificationTokenExpiresAt?:Date|null;
    password: string;
    firstName:string;
    middleName?:string|null;
    lastName:string;
    username: string;
    profilePicture?:string|null;
    roles: string[];
    loginType: LoginType;
    googleAccessToken?:string|null;
    googleRefreshToken?:string|null;
    createdAt: Date;
    updatedAt: Date;
}