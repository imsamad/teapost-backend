import { NextFunction, Request, Response } from 'express';

import passport from 'passport';
import { asyncHandler, ErrorResponse, getToken } from '../../lib/utils';
import OAuthToken from '../../models/OAuthToken';
import User from '../../models/User';
const POST_LOGIN_REDIRECT = process.env.POST_LOGIN_REDIRECT!;

export const twitterLoginHndlr = passport.authenticate('twitter', {
  scope: ['openid', 'profile', 'email'],
  session: false,
});

export const twitterRedirectCtrl = [
  passport.authenticate('twitter'),
  /*
 {
    failureRedirect: `${POST_LOGIN_REDIRECT}/auth`,
    failureMessage: true,
    // successReturnToOrRedirect: 'http://localhost:3000',
  }
 */
  asyncHandler(async (req: Request, res: Response) => {
    if (!POST_LOGIN_REDIRECT) {
      // sos to developer team
    }
    console.log('req.user ', req.user);
    let user = await User.findById(req.user);
    // @ts-ignore
    let getTokenFor = getToken(user);

    await OAuthToken.findByIdAndUpdate(
      req.user,
      { token: getTokenFor },
      { upsert: true }
    );
    console.log('token from cb ', req.user);
    res.redirect(`${POST_LOGIN_REDIRECT}/authRedirect?token=${req.user}`);
  }),
];

export const getOAuthToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = await OAuthToken.findById(req.params.userId);
    if (!token?.token)
      return next(
        ErrorResponse(404, {
          message: 'Invalid entities',
        })
      );
    res.json({
      ...token.token,
    });
  }
);
