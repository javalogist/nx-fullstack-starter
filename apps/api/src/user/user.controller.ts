import { Get, Body, Controller, Post, Param, Put, Delete } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./schemas/user.schema";
import { CreateUserDto, UpdateUserDto } from "./dtos/user.dto";
import { plainToInstance } from "class-transformer";
import { BaseController, CurrentUser, Roles } from "@nx-fullstack-starter/backend";
import { Role } from "@nx-fullstack-starter/shared";


@Controller('user')
export class UserController extends BaseController {
 constructor(private readonly userService: UserService) {
    super();
 }

 @Get()
 @Roles(Role.SUPER_ADMIN)
 async getUsers() {
    return this.success(await this.userService.findAll(),'Users fetched successfully');
 }

 @Post()
 @Roles(Role.SUPER_ADMIN)
 async createUser(@Body() userDto: CreateUserDto) {
   const user = plainToInstance(User, userDto);
    return this.success(await this.userService.create(user),'User created successfully');
 }

 @Get(':id')
 @Roles(Role.SUPER_ADMIN)
 async getUser(@Param('id') id: string) {
   return this.success(await this.userService.findById(id),'User fetched successfully');
 }

 @Put(':id')
 @Roles(Role.SUPER_ADMIN)
 async updateUser(@Param('id') id: string, @Body() userDto: UpdateUserDto) {
   return this.success(await this.userService.update(id, userDto),'User updated successfully');
 }

 @Delete(':id')
 @Roles(Role.SUPER_ADMIN)
 async deleteUser(@Param('id') id: string) {
   await this.userService.delete(id);
   return this.success(null, 'User deleted successfully');
 }

 @Delete()
 @Roles(Role.SUPER_ADMIN)
 async deleteAllUsers(): Promise<any> {
    await this.userService.deleteAll();
    return this.success(null, 'All users deleted successfully');
 }

 @Get('me')
 async getMe(@CurrentUser() user: User) {
   return this.success(await this.userService.findById(user.id),'User fetched successfully');
 }

}