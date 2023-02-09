import express from 'express';
import helmet from 'helmet';
const router = express();
import authCtrl from '../controller/authCtrl';
import { protect } from '../middleware/auth';

router.post('/register', authCtrl.register);

router.get('/google_login', authCtrl.googleLoginHndlr);
router.get('/google_cb', authCtrl.googleRedirectCtrl);
// router.get('/twitter_login', authCtrl.twitterLoginHndlr);
// router.get('/twitter_cb', authCtrl.twitterRedirectCtrl);

router.get('/oauthtoken/:userId', authCtrl.getOAuthToken);

router.get(
  ['/verifyRegistration/:token', '/verifyChangedEmail/:token'],
  authCtrl.verifyEmail
);

router.post('/login', authCtrl.logIn);

router.post('/forgotpassword', authCtrl.forgotPassword);

router
  .route('/resetpassword/:resettoken')
  .get(
    helmet({
      contentSecurityPolicy: false,
    }),
    authCtrl.resetPaswordPage
  )
  .put(authCtrl.resetPasword);

router.get('/forgotidentifier', authCtrl.forgotIdentifier);
router.post('/forgotidentifier', authCtrl.forgotIdentifier);

/************* Protected routes **************/
router.use(protect);

router.get(['/me', '/'], authCtrl.getMe);

router.put(['/changeemail', '/updateemail'], authCtrl.changeEmail);

router.put(['/', '/update'], authCtrl.updateDetails);

router.delete(['/', '/deleteMe', '/deactivate'], authCtrl.deleteMe);

router.patch(
  ['/follow/:authorId', '/unfollow/:authorId'],
  authCtrl.followAuthor
);

export default router;
