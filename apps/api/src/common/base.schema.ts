import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export abstract class BaseSchema {
    @Prop({ type: Types.ObjectId, auto: true })
    _id: Types.ObjectId;
  
    get id(): string {
      return this._id?.toString();
    }
  }
  