"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOAuthToken = exports.googleRedirectCtrl = exports.googleLoginHndlr = void 0;
const passport_1 = __importDefault(require("passport"));
const utils_1 = require("../../lib/utils");
const OAuthToken_1 = __importDefault(require("../../models/OAuthToken"));
const User_1 = __importDefault(require("../../models/User"));
const POST_LOGIN_REDIRECT = process.env.POST_LOGIN_REDIRECT;
exports.googleLoginHndlr = passport_1.default.authenticate('google', {
    scope: ['openid', 'profile', 'email'],
    session: false,
});
exports.googleRedirectCtrl = [
    passport_1.default.authenticate('google', {
        failureRedirect: `${POST_LOGIN_REDIRECT}/auth`,
        failureMessage: true,
    }),
    (0, utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!POST_LOGIN_REDIRECT) {
        }
        let user = yield User_1.default.findById(req.user);
        let getTokenFor = (0, utils_1.getToken)(user);
        yield OAuthToken_1.default.findByIdAndUpdate(req.user, { token: getTokenFor }, { upsert: true });
        console.log('token from cb ', req.user);
        res.redirect(`${POST_LOGIN_REDIRECT}/authRedirect?token=${req.user}`);
    })),
];
exports.getOAuthToken = (0, utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield OAuthToken_1.default.findById(req.params.userId);
    if (!(token === null || token === void 0 ? void 0 : token.token))
        return next((0, utils_1.ErrorResponse)(404, {
            message: 'Invalid entities',
        }));
    res.json(Object.assign({}, token.token));
}));
