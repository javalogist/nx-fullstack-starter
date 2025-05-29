import { BusinessLogicException } from "@nx-fullstack-starter/backend";
import { Injectable } from "@nestjs/common";
import { User, UserDocument } from "./schemas/user.schema";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name, 'user') private userModel: Model<UserDocument>
    ) { }

    private generateUsername(firstName: string, middleName: string, lastName: string | null = null): string {
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


    public async getUsername(firstName: string, middleName: string, lastName: string | null = null): Promise<string> {
        const username = this.generateUsername(firstName, middleName, lastName);
        if (await this.isUsernameUnique(username)) {
            return username;
        }
        return this.getUsername(firstName, middleName, lastName);
    }

    findAll(): Promise<UserDocument[]> {
        return this.userModel.find();
    }

    findById(id: string): Promise<UserDocument> {
        return this.userModel.findOne({ _id: new Types.ObjectId(id) });
    }

    async findByEmail(email: string): Promise<UserDocument> {
        const user = await this.userModel.findOne({ email });
        return user;
    }

    async create(userData: Partial<User>): Promise<UserDocument> {
        // Check if user with email already exists
        const existingUser = await this.userModel.findOne({ email: userData.email });
        if (existingUser) {
            throw new BusinessLogicException('User with this email already exists');
        }

        // Add username to userData
        userData.username = await this.getUsername(userData.firstName, userData.middleName, userData.lastName);

        // Create new user
        return this.userModel.create(userData);
    }

    update(id: string, userData: Partial<User>): Promise<UserDocument> {
        return this.userModel.findByIdAndUpdate(id, userData, { new: true });
    }

    delete(id: string): Promise<void> {
        return this.userModel.findByIdAndDelete(id);
    }

    async deleteAll(): Promise<void> {
        await this.userModel.deleteMany({
            roles: { $nin: ['super_admin'] }
        });
    }

    findOrCreateOAuthUser(provider: string, email: string, profile: any): Promise<UserDocument> {
        return this.userModel.findOne({ email });
    }

}