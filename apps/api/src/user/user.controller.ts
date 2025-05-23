import { Get, Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.schema";
import { CreateUserDto } from "./user.dto";
import { plainToInstance } from "class-transformer";
import { Public, Roles } from "@kodevy-core-2.0/backend";
import { Role } from "@kodevy-core-2.0/shared";


@Controller('user')
export class UserController {
 constructor(private readonly userService: UserService) {}

 @Get()
 @Roles(Role.SUPER_ADMIN)
 async getUsers(): Promise<User[]> {
    return this.userService.findAll();
 }

 @Post()
 @Roles(Role.SUPER_ADMIN)
 async createUser(@Body() userDto: CreateUserDto): Promise<User> {
   const user = plainToInstance(User, userDto);
    return this.userService.create(user);
 }
}