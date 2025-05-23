import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { IBaseUser } from '@kodevy-core-2.0/shared';
import { LoginType } from '@kodevy-core-2.0/shared';
import { BaseSchema } from '../common/base.schema';

@Schema({
  timestamps: true, // This will automatically add createdAt and updatedAt fields
  collection: 'users'
})
export class User extends BaseSchema implements IBaseUser {

  @Prop({ required: false, default: null })
  googleId?: string | null;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, default: false })
  isEmailVerified: boolean;

  @Prop({
    required: function () {
      return this.loginType === LoginType.LOCAL;
    },
    type: String,
  })
  password: string;

  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: false, default: null, trim: true })
  middleName?: string | null;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, unique: true, sparse: true, trim: true })
  username: string | null;

  @Prop({ required: false, default: null })
  profilePicture?: string | null;

  @Prop({ required: true, type: [String], default: ['user'] })
  roles: string[];

  @Prop({ 
    required: true,
    enum: Object.values(LoginType), 
    type: String, 
    default: LoginType.LOCAL,
  })
  loginType: LoginType;

  @Prop({ required: false, default: null })
  googleAccessToken?: string | null;

  @Prop({ required: false, default: null })
  googleRefreshToken?: string | null;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: Date.now })
  updatedAt: Date;

  @Prop()
  emailVerificationToken?: string;

  @Prop()
  emailVerificationTokenExpiresAt?: Date;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

// Add indexes for better query performance
//for email and username, unique true will create the index
UserSchema.index({ googleId: 1 });
