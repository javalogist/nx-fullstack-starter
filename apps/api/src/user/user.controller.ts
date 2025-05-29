import { Get, Body, Controller, Post, Param, Put, Delete } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./schemas/user.schema";
import { CreateUserDto, UpdateUserDto } from "./dtos/user.dto";
import { plainToInstance } from "class-transformer";
import {  BaseController, CurrentUser, Roles } from "@nx-fullstack-starter/backend";
import { ApiResponse, Role } from "@nx-fullstack-starter/shared";


@Controller('user')
export class UserController extends BaseController {
 constructor(private readonly userService: UserService) {
    super();
 }

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

 @Delete()
 @Roles(Role.SUPER_ADMIN)
 async deleteAllUsers(): Promise<any> {
    await this.userService.deleteAll();
    return this.success(null, 'All users deleted successfully');
 }

 @Get('me')
 async getMe(@CurrentUser() user: User): Promise<User> {
   return this.userService.findById(user.id);
 }

}