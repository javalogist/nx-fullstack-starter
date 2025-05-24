import { Get, Body, Controller, Post, Param, Put, Delete } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./schemas/user.schema";
import { CreateUserDto, UpdateUserDto } from "./dtos/user.dto";
import { plainToInstance } from "class-transformer";
import {  CurrentUser, Roles } from "@kodevy-core-2.0/backend";
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

 @Get(':id')
 @Roles(Role.SUPER_ADMIN)
 async getUser(@Param('id') id: string): Promise<User> {
   return this.userService.findById(id);
 }

 @Put(':id')
 @Roles(Role.SUPER_ADMIN)
 async updateUser(@Param('id') id: string, @Body() userDto: UpdateUserDto): Promise<User> {
   return this.userService.update(id, userDto);
 }

 @Delete(':id')
 @Roles(Role.SUPER_ADMIN)
 async deleteUser(@Param('id') id: string): Promise<void> {
   return this.userService.delete(id);
 }

 @Get('me')
 async getMe(@CurrentUser() user: User): Promise<User> {
   return this.userService.findById(user.id);
 }

}