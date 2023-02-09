import passport from 'passport';
import * as Twitter from 'passport-twitter';
import User from '../../models/User';
const Strategy = Twitter.Strategy;

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
      consumerKey: process.env.TWITTER_API_KEY!,

      consumerSecret: process.env.TWITTER_API_KEY_SECRET!,

      callbackURL:
        '/api/v1/auth/twitter_cb' ||
        'http://localhost:4000/api/v1/auth/twitter_cb' ||
        `http://teapost-backend.onrender.com/api/v1/auth/twitter_cb`,

      // includeEmail: true,
      // includeStatus: true,
      // includeEntities: true,
    },
    // @ts-ignore
    async function (accessToken, refreshToken, { _raw, ...rest }, done) {
      const profile = rest;
      let twitterId = profile.id;

      let userByTwitterId = await User.findOne({ twitterId });
      if (!userByTwitterId) {
        const newUser = await User.create({
          username: profile.username,
          fullName: profile.displayName,
          twitterId: profile.id,
          profilePic: profile?.photos?.[0]?.value,
          isEmailVerified: true,
          isAuthorised: true,
          oauthStrategy: 'twitter',
          oauthData: profile,
        });
        return done(null, newUser);
      } else {
        console.log('enter two');

        userByTwitterId.oauthData = profile;
        userByTwitterId.profilePic =
          userByTwitterId.profilePic || profile?.photos?.[0]?.value || '';
        if (
          !userByTwitterId.oauthStrategy ||
          userByTwitterId.oauthStrategy == 'twitter'
        )
          userByTwitterId.oauthData = profile;
        // collect other strategy data plus google strategy
        else
          userByTwitterId.oauthData = {
            ...userByTwitterId.oauthData,
            ...profile,
          };
        userByTwitterId.oauthStrategy = 'twitter';
        userByTwitterId = await userByTwitterId.save();
        console.log('userByTwitterId third', userByTwitterId);

        return done(null, userByTwitterId);
      }
    }
  )
);
