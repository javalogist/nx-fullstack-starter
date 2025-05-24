import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}


export class SuperAdminRegisterDto extends CreateUserDto {
@IsString()
@IsNotEmpty()
registrationToken:string;
}