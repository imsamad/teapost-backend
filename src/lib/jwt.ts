import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import ms from 'ms';
import session from 'express-session';
import cookieSession from 'cookie-session';
const jwtSecret = process.env.JWT_SECRET!,
  jwtExpire = process.env.JWT_EXPIRE! || '1d',
  jwtIssuer = process.env.JWT_ISSUER!;

export const cookies = () => {
  console.log({ maxAge: ms(jwtExpire), keys: [jwtSecret] });
  return cookieSession();
};

export const expressSession = () =>
  session({
    secret: jwtSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      httpOnly: true,
      domain: 'http://localhost:4000',
      // @ts-ignore
      expires: ms(jwtExpire),
    },
  });

export const signJwt = (
  data: any,
  secret: string = jwtSecret,
  { expiresIn = jwtExpire, issuer = jwtIssuer, ...rest }: SignOptions = {}
): string => {
  return jwt.sign(data, secret, {
    issuer, //@ts-ignore
    expiresIn: ms(expiresIn),
    ...rest,
  });
};

export const decodeJwt = (
  token: string,
  secret: string = jwtSecret,
  { issuer = jwtIssuer, ...rest }: VerifyOptions = {}
): object | boolean => {
  try {
    const decoded: {} = jwt.verify(token, secret, { issuer, ...rest });

    return decoded;
  } catch (error) {
    console.log('Error from jwt decoding ', error);
    return false;
  }
};
