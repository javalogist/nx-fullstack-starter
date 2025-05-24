
export type UserModel = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  googleId: any | null;
  email: any | null;
  isEmailVerified: any | null;
  firstName: any | null;
  middleName: any | null;
  lastName: any | null;
  username: any | null;
  profilePicture: any | null;
  roles: any | null;
  loginType: any | null;
  googleAccessToken: any | null;
  googleRefreshToken: any | null;
}
