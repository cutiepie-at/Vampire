import Value from '../models/db/Value';
import type {TransactionOrKnex} from 'objection';
import type {UUID} from '../models/db/util';

export default class ValueRepository {
  async getAll(createdBy: UUID, trx?: TransactionOrKnex): Promise<Value[]> {
    return Value.query(trx).where('createdBy', createdBy);
  }

  async getById(id: string, createdBy: UUID, trx?: TransactionOrKnex): Promise<Value | undefined> {
    return Value.query(trx).where('createdBy', createdBy).findById(id);
  }

  async add(value: Value, trx?: TransactionOrKnex): Promise<Value> {
    return Value.query(trx).insert(value);
  }

  async addBatch(values: Value[], trx?: TransactionOrKnex): Promise<Value[]> {
    const job = async (trx2: TransactionOrKnex) => {
      const ret = [];
      for (let value of values) {
        ret.push(await this.add(value, trx2));
      }
      return ret;
    };
    if (trx) {
      return await job(trx);
    } else {
      return Value.transaction(async trx2 => {
        return await job(trx2);
      });
    }
  }

  async update(value: Value, trx?: TransactionOrKnex): Promise<boolean> {
    return await Value.query(trx).findById(value.id).update(value) === 1;
  }

  async remove(id: string, createdBy: UUID, trx?: TransactionOrKnex): Promise<boolean> {
    return await Value.query(trx).where('createdBy', createdBy).findById(id).delete() === 1;
  }

  async removeByReportId(reportId: string, createdBy: UUID, trx?: TransactionOrKnex): Promise<void> {
    await Value.query(trx).where('createdBy', createdBy).where('reportId', reportId).delete();
  }
}