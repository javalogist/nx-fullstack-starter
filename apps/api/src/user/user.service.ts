import { IUserService } from "@kodevy-core-2.0/backend";
import { IBaseUser } from "@kodevy-core-2.0/shared";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService implements IUserService<IBaseUser>{

    update(id: string, userData: Partial<IBaseUser>): Promise<IBaseUser> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    validateUser(email: string, password: string): Promise<IBaseUser> {
        throw new Error("Method not implemented.");
    }
    validatePassword(user: IBaseUser, password: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    findOrCreateOAuthUser(provider: string, email: string, profile: any): Promise<IBaseUser> {
        throw new Error("Method not implemented.");
    }
    async findById(id: string): Promise<IBaseUser> {
        throw new Error("Method not implemented.");
    }
    async findByEmail(email: string): Promise<IBaseUser> {
        throw new Error("Method not implemented.");
    }   
    async create(user: IBaseUser): Promise<IBaseUser> {
        throw new Error("Method not implemented.");
    }

    
}