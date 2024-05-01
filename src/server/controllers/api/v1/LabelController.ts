import type {NextFunction, Request, Response} from 'express';
import {UniqueViolationError} from 'db-errors';
import {randomUUID} from 'crypto';
import LabelRepository from '$/repository/LabelRepository';
import Label from '$/models/db/Label';

export default class LabelController {
  private repo = new LabelRepository();

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const labels = await this.repo.getAll(req.session.user!.id);
      res.status(200).json(labels);
    } catch (e) {
      next(e);
      return;
    }
    next();
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const label = await this.repo.getById(req.session.user!.id, id);
      if (label !== undefined) {
        res.status(200).json(label);
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
      let label = Label.fromJson(req.body);

      label.id = randomUUID();
      label.createdBy = req.session.user!.id;
      label.updatedBy = req.session.user!.id;
      try {
        label = await this.repo.add(label);
      } catch (err) {
        if (err instanceof UniqueViolationError) {
          res.status(409).end();
          next();
          return;
        }
        next(err);
        return;
      }
      res.status(201).json(label);
    } catch (e) {
      next(e);
      return;
    }
    next();
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const label = Label.fromJson(req.body);

      //get from db
      const dblabel = await this.repo.getById(label.id, req.session.user!.id);
      if (!dblabel) {
        res.status(404).end();
        next();
        return;
      }

      //update props
      dblabel.name = label.name;
      dblabel.description = label.description;
      dblabel.unit = label.unit;
      dblabel.color = label.color;
      dblabel.minReference = label.minReference;
      dblabel.maxReference = label.maxReference;
      dblabel.updatedBy = req.session.user!.id;

      //save
      const updated = await this.repo.update(dblabel);
      if (updated) {
        res.status(200).json(dblabel);
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
      const deleted = await this.repo.remove(id, req.session.user!.id);
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


