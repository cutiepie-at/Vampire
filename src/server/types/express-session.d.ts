import type {Request} from 'express';
import type UserInfo from '$/models/api/v1/user/UserInfo';

declare module 'express-session' {
  interface SessionData {
    req?: Request;

    authed?: boolean;
    userId?: string;
    user?: UserInfo;// todo rename to userInfo
  }
}