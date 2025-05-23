import {Types } from 'mongoose';

export abstract class BaseSchema {
    _id: Types.ObjectId;
  
    get id(): string {
      return this._id?.toString();
    }
  }
  