import type {NextFunction, Request, Response} from 'express';
import UserSessionRepository from '$/repository/UserSessionRepository';
import UserSessionInfo from '$/models/api/v1/user/UserSessionInfo';

export default class UserSessionController {
  private repo = new UserSessionRepository();

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessions = await this.repo.getByUserId(req.session.user!.id);
      const infos = sessions.map(e => UserSessionInfo.fromSession(e));
      res.status(200).json(infos);
    } catch (e) {
      next(e);
      return;
    }
    next();
  }

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const session = await this.repo.getById(req.params.id);
      if (session === undefined) {
        res.status(401);//don't expose that we do not have the data
        next();
        return;
      }

      if (session.userId !== req.session.user!.id) {
        res.status(401);
        next();
        return;
      }

      const deleted = await this.repo.remove(id);
      if (deleted) {
        res.status(204);
      } else {
        res.status(404);
      }
    } catch (e) {
      next(e);
      return;
    }
    next();
  }
}