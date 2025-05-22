import { BusinessLogicException, IUserService } from "@kodevy-core-2.0/backend";
import { Injectable } from "@nestjs/common";
import { User } from "./user.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class UserService implements IUserService<User>{
    constructor(
        @InjectModel(User.name,'user') private userModel: Model<User>
    ){}

    private generateUsername(firstName: string, middleName: string, lastName: string): string {
        const firstInitial = firstName ? firstName.charAt(0).toLowerCase() : '';
        const middleInitial = middleName ? middleName.charAt(0).toLowerCase() : '';
        const lastInitial = lastName ? lastName.charAt(0).toLowerCase() : '';
        const randomNum = Math.floor(Math.random() * 1000);
        return `${firstInitial}${middleInitial}${lastInitial}${randomNum}`;
    }

    private async isUsernameUnique(username: string): Promise<boolean> {
        const existingUser = await this.userModel.findOne({ username });
        return !existingUser;
    }

    findAll(): Promise<User[]> {
        return this.userModel.find();
    }
    findById(id: string): Promise<User> {
        return this.userModel.findById(id);
    }
    findByEmail(email: string): Promise<User> {
        return this.userModel.findOne({ email });
    }
    async create(userData: Partial<User>): Promise<User> {
        // Check if user with email already exists
        const existingUser = await this.userModel.findOne({ email: userData.email });
        if (existingUser) {
            throw new BusinessLogicException('User with this email already exists');
        }
        
        // Generate unique username
        let username = this.generateUsername(
            userData.firstName || '',
            userData.middleName || '',
            userData.lastName || ''
        );
        
        // Ensure username is unique
        while (!(await this.isUsernameUnique(username))) {
            username = this.generateUsername(
                userData.firstName || '',
                userData.middleName || '',
                userData.lastName || ''
            );
        }
        
        // Add username to userData
        userData.username = username;
        
        // Create new user
        return this.userModel.create(userData);
    }
    update(id: string, userData: Partial<User>): Promise<User> {
        return this.userModel.findByIdAndUpdate(id, userData, { new: true });
    }
    delete(id: string): Promise<void> {
        return this.userModel.findByIdAndDelete(id);
    }
    validateUser(email: string, password: string): Promise<User> {
        return this.userModel.findOne({ email, password });
    }
    validatePassword(user: User, password: string): Promise<boolean> {
        return this.userModel.findOne({ email: user.email, password });
    }
    findOrCreateOAuthUser(provider: string, email: string, profile: any): Promise<User> {
        return this.userModel.findOne({ email });
    }

    

    
}