import { plainToInstance } from "class-transformer";
import { Document } from "mongoose";

export function toModel<TModel, TEntity extends Document>(entity: TEntity): TModel {
    return plainToInstance(entity.constructor as new () => TModel, entity.toObject());
}

export function toModelArray<TModel, TEntity extends Document>(entities: TEntity[]): TModel[] {
    return entities.map(entity => toModel<TModel, TEntity>(entity));
}

export const parseBoolean = (value: string | undefined, defaultValue: boolean): boolean => {
    if (value === undefined) return defaultValue;
    return value.toLowerCase() === 'true';
  };