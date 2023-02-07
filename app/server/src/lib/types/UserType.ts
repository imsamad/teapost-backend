import ProfileType from './ProfileType';
interface User {
  _id: string;
  email: string;
  username: string;
  role: string | 'admin' | 'reader' | 'author';
  createdAt: Date;
  stories: number;
  fullName: string;
  profilePic: string;
  tagLines: string[];
  following: number;
  followers: number;
  isEmailVerified?: boolean;
  isAuthorised?: boolean;
  updatedAt?: Date;
  profile?: ProfileType;
  oauthStrategy: 'google' | 'twitter' | 'instagram' | 'local';
  googleId: string;
  oauthData: Object;
}

export default User;
