import * as bcrypt from 'bcrypt';
import type {NextFunction, Request, Response} from 'express';
import {LogoutResponse} from '$/models/api/v1/auth/LogoutModels';
import type {ConfigType} from '$/config/confighelper';
import {isAuthenticated} from '$/middleware/auth';
import {LoginRequest, LoginResponse} from '$/models/api/v1/auth/LoginModels';
import {RegisterRequest, RegisterResponse} from '$/models/api/v1/auth/RegisterModels';
import User from '$/models/db/User';
import UserRepository from '$/repository/UserRepository';
import UserSessionRepository from '$/repository/UserSessionRepository';
import {VerifyResponse} from '$/models/api/v1/auth/VerifyModels';
import UserInfo from '$/models/api/v1/user/UserInfo';
import UserSessionInfo from '$/models/api/v1/user/UserSessionInfo';

export default class AuthController {
  private readonly userRepo = new UserRepository();
  private readonly sessionRepo = new UserSessionRepository();

  private readonly config: ConfigType;

  constructor(config: ConfigType ) {
    this.config = config;
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!this.config.server.features.auth.register) {
        res.status(403).json(RegisterResponse.REGISTRATION_DISABLED);
        next();
        return;
      }

      const register = RegisterRequest.fromJson(req.body);
      let user = await this.userRepo.getByName(register.username);
      if (user !== undefined) {
        res.status(409).json(RegisterResponse.USER_ALREADY_EXISTS);//conflict
        next();
        return;
      }

      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(register.password, salt);

      const uuid = crypto.randomUUID();
      user = User.new(uuid, register.username, register.username, hash, uuid);
      await this.userRepo.add(user);

      await this.generateSession(req, user);
      const userInfo = UserInfo.fromUser(user);
      const session = (await this.sessionRepo.getById(req.session.id))!;
      const sessionInfo = UserSessionInfo.fromSession(session);
      res.status(200).json(RegisterResponse.success(userInfo, sessionInfo));
    } catch (err) {
      next(err);
      return;
    }
    next();
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const login = LoginRequest.fromJson(req.body);
      const user = await this.userRepo.getByName(login.username);
      if (user === undefined) {//TODO prevent timing side channel
        res.status(401).json(LoginResponse.USERNAME_OR_PASSWORD_WRONG);
        next();
        return;
      }

      const success = user.password && await bcrypt.compare(login.password, user.password);
      if (!success) {
        res.status(401).json(LoginResponse.USERNAME_OR_PASSWORD_WRONG);
        next();
        return;
      }

      await this.generateSession(req, user);
      const userInfo = UserInfo.fromUser(user);
      const session = (await this.sessionRepo.getById(req.session.id))!;
      const sessionInfo = UserSessionInfo.fromSession(session);
      res.status(200).json(LoginResponse.success(userInfo, sessionInfo));
    } catch (err) {
      next(err);
      return;
    }
    next();
  }

  async verify(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!isAuthenticated(req)) {
        res.status(401).json(VerifyResponse.NOT_AUTHENTICATED);
        next();
        return;
      }
      const user = (await this.userRepo.getById(req.session.userId!))!;
      const userInfo = UserInfo.fromUser(user);
      const session = (await this.sessionRepo.getById(req.session.id))!;
      const sessionInfo = UserSessionInfo.fromSession(session);
      res.status(200).json(VerifyResponse.success(userInfo, sessionInfo));
    } catch (err) {
      next(err);
      return;
    }
    next();
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!isAuthenticated(req)) {
        res.status(200).json(LogoutResponse.SUCCESS);
        next();
        return;
      }

      await this.destroySession(req);
      res.status(200).json(LogoutResponse.SUCCESS);
    } catch (err) {
      next(err);
      return;
    }
    next();
  }

  private generateSession(req: Request, user: User): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.regenerate(function (err) {
        if (err) {
          reject(err);
          return;
        }
        req.session.authed = true;
        req.session.userId = user.id;
        req.session.user = UserInfo.fromUser(user);
        req.session.save(function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
  }

  private destroySession(req: Request): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy(function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

