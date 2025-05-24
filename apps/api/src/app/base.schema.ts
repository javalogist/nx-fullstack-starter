import { Types, Schema } from 'mongoose';

export abstract class BaseSchema {
    get id(): string {
      return (this as any)._id?.toString();
    }

    createdAt: Date;
    updatedAt: Date;
}

// Common schema configuration function
export function configureSchema(schema: Schema) {
  // Configure schema to include virtuals
  schema.set('toJSON', {
    virtuals: true,
    transform: (doc: any, ret: any) => {
      ret.id = ret._id;
      delete ret.__v;
      return ret;
    },
  });

  schema.set('toObject', {
    virtuals: true,
    transform: (doc: any, ret: any) => {
      ret.id = ret._id;
      delete ret.__v;
      return ret;
    },
  });
}
  