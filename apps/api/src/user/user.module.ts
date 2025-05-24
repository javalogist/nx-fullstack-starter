import { Module } from "@nestjs/common";
import { UserSchema } from "./schemas/user.schema";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User } from "./schemas/user.schema";

@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }],'user')],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
