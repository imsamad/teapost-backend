import mongoose from 'mongoose';
import { ErrorResponse } from '../lib/utils';
import bcrypt from 'bcrypt';
import UserType from '../lib/types/UserType';

export interface UserDocument extends Omit<UserType, '_id'>, mongoose.Document {
  matchPassword(candidatePassword: string): Promise<boolean>;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    profilePic: String,
    username: {
      type: String,
      required: [true, 'Please add a name'],
      minlength: [4, "Username's minimum length must be 4."],
    },
    email: {
      type: String,
      // required: [true, 'Please add an email'],
      // unique: true,
      // match: [
      //   /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      //   "Please add a valid email",
      // ],
    },
    password: {
      type: String,
      // required: [true, 'Please add a password'],
      minlength: [6, "Password's minimum length must be 6."],
      select: false,
    },
    tagLines: [String],
    role: {
      type: String,
      enum: ['admin', 'reader', 'author'],
      default: 'reader',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    // Only Admin can modified this value
    isAuthorised: {
      type: Boolean,
      default: true,
      required: true,
    },
    following: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    stories: { type: Number, default: 0, required: true },
    oauthStrategy: {
      type: String,
      enum: ['google', 'twitter', 'instagram', 'local'],
    },
    twitterId: String,
    googleId: String,
    oauthData: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

// Do sth here bcoz ,sth might be missing.

userSchema.post('save', function (error: any, doc: UserDocument, next: any) {
  if (error?.code === 11000) {
    next(
      ErrorResponse(400, {
        email: `${doc.email || 'This email'} already registered.`,
      })
    );
  } else {
    next(error);
  }
});

userSchema.pre('remove', async function (next) {
  await this.model('Asset').findByIdAndRemove(this._id);
  await this.model('Profile').findByIdAndRemove(this._id);
  await this.model('StoryCollection').deleteMany({ user: this._id });

  let stories = await this.model('Story').find({
    author: this._id,
  });
  const myPrimaryComment = await this.model('Primary').find({ user: this._id });
  const mySecondaryComments = await this.model('Secondary').find({
    user: this._id,
  });
  let promises: any = [];
  promises.push(...stories.map((story: any) => story.remove()));
  promises.push(...myPrimaryComment.map((story: any) => story.remove()));
  promises.push(...mySecondaryComments.map((story: any) => story.remove()));
  Promise.allSettled(promises)
    .then((res: any) => {})
    .finally(() => {
      next();
    });
});

userSchema.pre('save', async function (next) {
  const user = this as UserDocument;
  if (!user.isModified('password')) return next();

  const saltFactor: number = Number(process.env.SALT_FACTOR) || 10;

  const salt = await bcrypt.genSalt(saltFactor);

  const hash = await bcrypt.hashSync(user.password, salt);

  user.password = hash;

  return next();
});

userSchema.methods.matchPassword = async function (
  enterPassword: UserDocument['password']
) {
  return await bcrypt.compare(enterPassword, this.password);
};

userSchema.virtual('profile', {
  ref: 'Profile',
  localField: '_id',
  foreignField: '_id',
  justOne: true,
});
const User = mongoose.model<UserDocument>('User', userSchema);

export default User;
export const peelUserDoc = (user: UserDocument) => {
  // @ts-ignore
  let copyUser = user?.toObject ? user?.toObject() : user;

  // @ts-ignore
  let { isEmailVerified, isAuthorised, updatedAt, password, id, __v, ...rest } =
    copyUser;
  let filteredUser: any = { ...rest };
  if (copyUser?.profile) {
    // @ts-ignore
    const {
      profile:
        // @ts-ignore
        {
          // @ts-ignore
          collabStories,
          // @ts-ignore
          storyCollections,
          // @ts-ignore
          dislikedStories,
          // @ts-ignore
          likedStories,
          ...rest
        },
    } = copyUser;
    filteredUser.profile = rest;
  }
  return filteredUser;
};
