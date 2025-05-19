import { IBaseUser } from "@kodevy-core-2.0/shared";

export interface IUserRepository<T extends IBaseUser> {
  findByEmail(email: string): Promise<T | null>;
  findById(id: string): Promise<T | null>;
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: string, data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<T>;
  delete(id: string): Promise<boolean>;
} 