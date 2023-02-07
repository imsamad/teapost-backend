"use strict";
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
exports.decodeJwt = exports.signJwt = exports.expressSession = exports.cookies = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ms_1 = __importDefault(require("ms"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const jwtSecret = process.env.JWT_SECRET, jwtExpire = process.env.JWT_EXPIRE || '1d', jwtIssuer = process.env.JWT_ISSUER;
const cookies = () => {
    console.log({ maxAge: (0, ms_1.default)(jwtExpire), keys: [jwtSecret] });
    return (0, cookie_session_1.default)();
};
exports.cookies = cookies;
const expressSession = () => (0, express_session_1.default)({
    secret: jwtSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
        httpOnly: true,
        domain: 'http://localhost:4000',
        expires: (0, ms_1.default)(jwtExpire),
    },
});
exports.expressSession = expressSession;
const signJwt = (data, secret = jwtSecret, _a = {}) => {
    var { expiresIn = jwtExpire, issuer = jwtIssuer } = _a, rest = __rest(_a, ["expiresIn", "issuer"]);
    return jsonwebtoken_1.default.sign(data, secret, Object.assign({ issuer, expiresIn: (0, ms_1.default)(expiresIn) }, rest));
};
exports.signJwt = signJwt;
const decodeJwt = (token, secret = jwtSecret, _a = {}) => {
    var { issuer = jwtIssuer } = _a, rest = __rest(_a, ["issuer"]);
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret, Object.assign({ issuer }, rest));
        return decoded;
    }
    catch (error) {
        console.log('Error from jwt decoding ', error);
        return false;
    }
};
exports.decodeJwt = decodeJwt;
