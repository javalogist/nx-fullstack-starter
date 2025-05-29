import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IBaseUser } from '@nx-fullstack-starter/shared';
import { LoginType } from '@nx-fullstack-starter/shared';
import { BaseSchema, configureSchema } from '../../app/base.schema';
import { comparePassword, hashPassword } from '@nx-fullstack-starter/backend';

@Schema({
  timestamps: true, 
  collection: 'users'
})
export class User extends BaseSchema implements IBaseUser {

  @Prop({ required: false, default: null })
  googleId: string | null;

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
  middleName: string | null;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, unique: true, sparse: true, trim: true })
  username: string | null;

  @Prop({ required: false, default: null })
  profilePicture: string | null;

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
  googleAccessToken: string | null;

  @Prop({ required: false, default: null })
  googleRefreshToken: string | null;

  @Prop()
  emailVerificationToken: string | null;

  @Prop()
  emailVerificationTokenExpiresAt: Date | null;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);


// Apply common schema configurations
configureSchema(UserSchema);

// Add indexes for better query performance
UserSchema.index({ googleId: 1 });

// Add pre-save middleware to hash password
UserSchema.pre('save', async function(next) {
  const user = this as UserDocument;
  
  // Only hash the password if it's modified (or new)
  if (!user.isModified('password')) {
    return next();
  }

  user.password = await hashPassword(user.password);
  next();
});

