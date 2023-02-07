import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import User, { UserDocument } from '../../models/User';
const Strategy = GoogleStrategy.Strategy;

passport.serializeUser((userId, done) => {
  console.log('userId from serializeUser', userId);
  done(null, userId);
});

passport.deserializeUser(async (userId, done) => {
  console.log('userId from deserializeUser', userId);

  // const user=await User.findById(userId);
  // @ts-ignore
  done(null, userId);
});

passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/api/v1/auth/google_cb',
      scope: ['profile', 'email'],
    },
    async function (accessToken, refreshToken, { _raw, ...rest }, done) {
      const profile = rest;
      let emailInProfile = profile?.emails?.[0]?.value || profile?._json?.email;
      let googleId = profile.id;
      /**
       * CASES
       * 1.) Got email in profile And account exist with that email -> update user data
       * 2.) Find Or Create With GogoleId
       */

      // Scenario - 1
      if (emailInProfile) {
        let userByEmail = await User.findOne({ email: emailInProfile });
        if (userByEmail) {
          if (userByEmail?.googleId != profile.id)
            userByEmail.googleId = profile.id;
          // if (profile._raw) delete profile._raw;
          if (
            !userByEmail.oauthStrategy ||
            userByEmail.oauthStrategy == 'google'
          )
            userByEmail.oauthData = profile;
          else userByEmail.oauthData = { ...userByEmail.oauthData, ...profile };
          userByEmail.oauthStrategy = 'google';
          await userByEmail.save();
          console.log('first');
          return done(null, userByEmail._id.toString());
        }
      }
      let userByGoogleId = await User.findOne({ googleId });

      if (!userByGoogleId) {
        // create new user;
        const newUser = await User.create({
          username: profile.displayName,
          fullName: profile.displayName,
          googleId: profile.id,
          email: emailInProfile || undefined,
          profilePic: profile?.photos?.[0]?.value,
          isEmailVerified: true,
          isAuthorised: true,
          oauthStrategy: 'google',
          oauthData: profile,
        });
        console.log('second', newUser._id.toString());

        return done(null, newUser._id.toString());
      } else {
        userByGoogleId.oauthData = profile;
        userByGoogleId.profilePic =
          userByGoogleId.profilePic || profile?.photos?.[0]?.value || '';
        if (
          !userByGoogleId.oauthStrategy ||
          userByGoogleId.oauthStrategy == 'google'
        )
          userByGoogleId.oauthData = profile;
        // collect other strategy data plus google strategy
        else
          userByGoogleId.oauthData = {
            ...userByGoogleId.oauthData,
            ...profile,
          };
        userByGoogleId.oauthStrategy = 'google';
        userByGoogleId = await userByGoogleId.save();
        console.log('third');

        return done(null, userByGoogleId._id.toString());
      }
    }
  )
);
