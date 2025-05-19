import { IBaseUser } from "@kodevy-core-2.0/shared";
// Type guard to ensure an object implements IBaseUser
export function isBaseUser(obj: any): obj is IBaseUser {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.password === 'string' &&
    Array.isArray(obj.roles) &&
    obj.roles.every((role: any) => typeof role === 'string') &&
    obj.createdAt instanceof Date &&
    obj.updatedAt instanceof Date
  );
}

// Type for creating a new user (omitting auto-generated fields)
export type CreateUserDto = Omit<IBaseUser, 'id' | 'createdAt' | 'updatedAt'>;

// Type for updating a user (all fields optional except id)
export type UpdateUserDto = Partial<Omit<IBaseUser, 'id' | 'createdAt' | 'updatedAt'>>; 