import Label from '../models/db/Label';
import type {TransactionOrKnex} from 'objection';
import type {UUID} from '../models/db/util';

export default class LabelRepository {
  async getAll(createdBy: UUID, trx?: TransactionOrKnex): Promise<Label[]> {
    return Label.query(trx).where('createdBy', createdBy);
  }

  async getById(id: string, createdBy: UUID, trx?: TransactionOrKnex): Promise<Label | undefined> {
    return Label.query(trx).where('createdBy', createdBy).findById(id);
  }

  async add(label: Label, trx?: TransactionOrKnex): Promise<Label> {
    return Label.query(trx).insert(label);
  }

  async update(label: Label, trx?: TransactionOrKnex): Promise<boolean> {
    return await Label.query(trx).findById(label.id).update(label) === 1;
  }

  async remove(id: string, createdBy: UUID, trx?: TransactionOrKnex): Promise<boolean> {
    return await Label.query(trx).where('createdBy', createdBy).findById(id).delete() === 1;
  }
}