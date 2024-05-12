import type {NextFunction, Request, Response} from 'express';
import {UniqueViolationError} from 'db-errors';
import {randomUUID} from 'crypto';
import ReportRepository from '../../../repository/ReportRepository';
import Report from '../../../models/db/Report';

export default class ReportController {
  private repo = new ReportRepository();

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reports = await this.repo.getAll(req.session.user!.id);
      res.status(200).json(reports);
    } catch (e) {
      next(e);
      return;
    }
    next();
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id!;
      const report = await this.repo.getById(req.session.user!.id, id);
      if (report !== undefined) {
        res.status(200).json(report);
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
      let report = Report.fromJson(req.body);

      report.id = randomUUID();
      report.createdBy = req.session.user!.id;
      report.updatedBy = req.session.user!.id;
      try {
        report = await this.repo.add(report);
      } catch (err) {
        if (err instanceof UniqueViolationError) {
          res.status(409).end();
          next();
          return;
        }
        next(err);
        return;
      }
      res.status(201).json(report);
    } catch (e) {
      next(e);
      return;
    }
    next();
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const report = Report.fromJson(req.body);

      //get from db
      const dbreport = await this.repo.getById(report.id, req.session.user!.id);
      if (!dbreport) {
        res.status(404).end();
        next();
        return;
      }

      //update props
      dbreport.date = report.date;
      dbreport.name = report.name;
      dbreport.lab = report.lab;
      dbreport.comment = report.comment;
      dbreport.updatedBy = req.session.user!.id;

      //save
      const updated = await this.repo.update(dbreport);
      if (updated) {
        res.status(200).json(dbreport);
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
