import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../interfaces/base-user.interface';
import { IUserService } from '../interfaces/user-service.interface';
import { IUserRepository } from '../interfaces/user-repository.interface';
import * as bcrypt from 'bcrypt';
import { IBaseUser } from '@kodevy-core-2.0/shared';

@Injectable()
export abstract class BaseUserService<T extends IBaseUser> implements IUserService<T> {
  constructor(protected readonly repository: IUserRepository<T>) {}

  async findByEmail(email: string): Promise<T | null> {
    return this.repository.findByEmail(email);
  }

  async findById(id: string): Promise<T | null> {
    return this.repository.findById(id);
  }

  async validatePassword(user: T, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  async create(data: CreateUserDto): Promise<T> {
    const hashedPassword = await this.hashPassword(data.password);
    return this.repository.create({
      ...data,
      password: hashedPassword,
    } as any);
  }

  async update(id: string, data: UpdateUserDto): Promise<T> {
    if ('password' in data && data.password) {
      data.password = await this.hashPassword(data.password);
    }
    return this.repository.update(id, data as any);
  }

  async delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  hasRole(user: T, role: string): boolean {
    return user.roles.includes(role);
  }

  hasAnyRole(user: T, roles: string[]): boolean {
    return roles.some(role => this.hasRole(user, role));
  }

  hasAllRoles(user: T, roles: string[]): boolean {
    return roles.every(role => this.hasRole(user, role));
  }

  protected async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
} 