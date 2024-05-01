import type {NextFunction, Request, Response} from 'express';
import {UniqueViolationError} from 'db-errors';
import {randomUUID} from 'crypto';
import UserRepository from '$/repository/UserRepository';
import UserInfo from '$/models/api/v1/user/UserInfo';
import User from '$/models/db/User';

export default class UserController {
  private repo = new UserRepository();

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await this.repo.getAll();
      const infos = users.map(e => UserInfo.fromUser(e));
      res.status(200).json(infos);
    } catch (e) {
      next(e);
      return;
    }
    next();
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const user = await this.repo.getById(id);
      if (user !== undefined) {
        res.status(200).json(UserInfo.fromUser(user));
      } else {
        res.status(404).end();
      }
    } catch (e) {
      next(e);
      return;
    }
    next();
  }

  async add(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let userInfo = UserInfo.fromJson(req.body);
      let user = User.fromUserInfo(userInfo);

      user.id = randomUUID();
      user.password = undefined;
      user.createdBy = req.session.user!.id;
      user.updatedBy = req.session.user!.id;
      try {
        user = await this.repo.add(user);
      } catch (err) {
        if (err instanceof UniqueViolationError) {
          res.status(409).end();
          next();
          return;
        }
        next(err);
        return;
      }
      res.status(201).json(UserInfo.fromUser(user));
    } catch (e) {
      next(e);
      return;
    }
    next();
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = UserInfo.fromJson(req.body);

      //get from db
      const dbuser = await this.repo.getById(user.id);
      if (!dbuser) {
        res.status(404).end();
        next();
        return;
      }

      //update props
      user.updatedBy = req.session.user!.id;

      //save
      const updated = await this.repo.update(dbuser);
      if (updated) {
        res.status(200).json(UserInfo.fromUser(dbuser));
      } else {
        res.status(404).end();
      }
    } catch (e) {
      next(e);
      return;
    }
    next();
  }

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const deleted = await this.repo.remove(id);
      if (deleted) {
        res.status(204).end();
      } else {
        res.status(404).end();
      }
    } catch (e) {
      next(e);
      return;
    }
    next();
  }
}


