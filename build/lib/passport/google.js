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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const User_1 = __importDefault(require("../../models/User"));
const Strategy = passport_google_oauth20_1.default.Strategy;
passport_1.default.serializeUser((userId, done) => {
    console.log('userId from serializeUser', userId);
    done(null, userId);
});
passport_1.default.deserializeUser((userId, done) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('userId from deserializeUser', userId);
    done(null, userId);
}));
passport_1.default.use(new Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/v1/auth/google_cb',
    scope: ['profile', 'email'],
}, function (accessToken, refreshToken, _a, done) {
    var _b, _c, _d, _e, _f, _g, _h;
    var { _raw } = _a, rest = __rest(_a, ["_raw"]);
    return __awaiter(this, void 0, void 0, function* () {
        const profile = rest;
        let emailInProfile = ((_c = (_b = profile === null || profile === void 0 ? void 0 : profile.emails) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.value) || ((_d = profile === null || profile === void 0 ? void 0 : profile._json) === null || _d === void 0 ? void 0 : _d.email);
        let googleId = profile.id;
        if (emailInProfile) {
            let userByEmail = yield User_1.default.findOne({ email: emailInProfile });
            if (userByEmail) {
                if ((userByEmail === null || userByEmail === void 0 ? void 0 : userByEmail.googleId) != profile.id)
                    userByEmail.googleId = profile.id;
                if (!userByEmail.oauthStrategy ||
                    userByEmail.oauthStrategy == 'google')
                    userByEmail.oauthData = profile;
                else
                    userByEmail.oauthData = Object.assign(Object.assign({}, userByEmail.oauthData), profile);
                userByEmail.oauthStrategy = 'google';
                yield userByEmail.save();
                console.log('first');
                return done(null, userByEmail._id.toString());
            }
        }
        let userByGoogleId = yield User_1.default.findOne({ googleId });
        if (!userByGoogleId) {
            const newUser = yield User_1.default.create({
                username: profile.displayName,
                fullName: profile.displayName,
                googleId: profile.id,
                email: emailInProfile || undefined,
                profilePic: (_f = (_e = profile === null || profile === void 0 ? void 0 : profile.photos) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.value,
                isEmailVerified: true,
                isAuthorised: true,
                oauthStrategy: 'google',
                oauthData: profile,
            });
            console.log('second', newUser._id.toString());
            return done(null, newUser._id.toString());
        }
        else {
            userByGoogleId.oauthData = profile;
            userByGoogleId.profilePic =
                userByGoogleId.profilePic || ((_h = (_g = profile === null || profile === void 0 ? void 0 : profile.photos) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.value) || '';
            if (!userByGoogleId.oauthStrategy ||
                userByGoogleId.oauthStrategy == 'google')
                userByGoogleId.oauthData = profile;
            else
                userByGoogleId.oauthData = Object.assign(Object.assign({}, userByGoogleId.oauthData), profile);
            userByGoogleId.oauthStrategy = 'google';
            userByGoogleId = yield userByGoogleId.save();
            console.log('third');
            return done(null, userByGoogleId._id.toString());
        }
    });
}));
