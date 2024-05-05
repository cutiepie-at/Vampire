import type {NextFunction, Request, Response} from 'express';
import {UniqueViolationError} from 'db-errors';
import {randomUUID} from 'crypto';
import ValueRepository from '../../../repository/ValueRepository';
import Value from '../../../models/db/Value';

export default class ValueController {
  private repo = new ValueRepository();

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const values = await this.repo.getAll(req.session.user!.id);
      res.status(200).json(values);
    } catch (e) {
      next(e);
      return;
    }
    next();
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id!;
      const value = await this.repo.getById(req.session.user!.id, id);
      if (value !== undefined) {
        res.status(200).json(value);
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
      let value = Value.fromJson(req.body);

      value.id = randomUUID();
      value.createdBy = req.session.user!.id;
      value.updatedBy = req.session.user!.id;
      try {
        value = await this.repo.add(value);
      } catch (err) {
        if (err instanceof UniqueViolationError) {
          res.status(409).end();
          next();
          return;
        }
        next(err);
        return;
      }
      res.status(201).json(value);
    } catch (e) {
      next(e);
      return;
    }
    next();
  }

  async addBatch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let values = (req.body as any[]).map(e => Value.fromJson(e));

      values.forEach(value => {
        value.id = randomUUID();
        value.createdBy = req.session.user!.id;
        value.updatedBy = req.session.user!.id;
      });
      try {
        values = await this.repo.addBatch(values);
      } catch (err) {
        if (err instanceof UniqueViolationError) {
          res.status(409).end();
          next();
          return;
        }
        next(err);
        return;
      }
      res.status(201).json(values);
    } catch (e) {
      next(e);
      return;
    }
    next();
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const value = Value.fromJson(req.body);

      //get from db
      const dbvalue = await this.repo.getById(value.id, req.session.user!.id);
      if (!dbvalue) {
        res.status(404).end();
        next();
        return;
      }

      //update props
      dbvalue.labelId = value.labelId;
      dbvalue.date = value.date;
      dbvalue.value = value.value;
      dbvalue.updatedBy = req.session.user!.id;

      //save
      const updated = await this.repo.update(dbvalue);
      if (updated) {
        res.status(200).json(dbvalue);
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
      const id = req.params.id!;
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


