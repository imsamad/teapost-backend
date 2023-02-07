import logIn from './login';
import register from './register';
import verifyEmail from './verifyEmail';
import getMe from './getMe';
import followAuthor from './followAuthor';
import changeEmail from './changeEmail';
import updateDetails from './updateDetails';
import forgotPassword from './forgotPassword';
import forgotIdentifier from './forgotIdentifier';
import deleteMe from './deleteMe';
import { resetPaswordPage, resetPasword } from './resetPasword';
import {
  googleLoginHndlr,
  googleRedirectCtrl,
  getOAuthToken,
} from './googleLoginHndlr';

export default {
  logIn,
  register,
  verifyEmail,
  getMe,
  followAuthor,
  resetPaswordPage,
  resetPasword,
  forgotPassword,
  changeEmail,
  updateDetails,
  forgotIdentifier,
  deleteMe,
  googleLoginHndlr,
  googleRedirectCtrl,
  getOAuthToken,
};
