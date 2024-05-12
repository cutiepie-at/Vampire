import Report from '../models/db/Report';
import type {TransactionOrKnex} from 'objection';
import type {UUID} from '../models/db/util';

export default class ReportRepository {
  async getAll(createdBy: UUID, trx?: TransactionOrKnex): Promise<Report[]> {
    return Report.query(trx).where('createdBy', createdBy);
  }

  async getById(id: string, createdBy: UUID, trx?: TransactionOrKnex): Promise<Report | undefined> {
    return Report.query(trx).where('createdBy', createdBy).findById(id);
  }

  async add(report: Report, trx?: TransactionOrKnex): Promise<Report> {
    return Report.query(trx).insert(report);
  }

  async update(report: Report, trx?: TransactionOrKnex): Promise<boolean> {
    return await Report.query(trx).findById(report.id).update(report) === 1;
  }

  async remove(id: string, createdBy: UUID, trx?: TransactionOrKnex): Promise<boolean> {
    return await Report.query(trx).where('createdBy', createdBy).findById(id).delete() === 1;
  }
}