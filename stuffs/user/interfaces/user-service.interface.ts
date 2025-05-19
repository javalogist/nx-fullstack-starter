import { IBaseUser } from "@kodevy-core-2.0/shared";
export interface IUserService<T extends IBaseUser> {
  findByEmail(email: string): Promise<T | null>;
  findById(id: string): Promise<T | null>;
  validatePassword(user: T, password: string): Promise<boolean>;
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: string, data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<T>;
  delete(id: string): Promise<boolean>;
  hasRole(user: T, role: string): boolean;
  hasAnyRole(user: T, roles: string[]): boolean;
  hasAllRoles(user: T, roles: string[]): boolean;
} 