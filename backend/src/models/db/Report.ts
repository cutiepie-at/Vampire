import BaseModelCreatedUpdated from '../../models/db/BaseModelCreatedUpdated';
import {mergeDeep} from '../../util/merge';
import type {JSONSchema, ModelOptions, Pojo, StaticHookArguments} from 'objection';
import {UUID} from 'node:crypto';

export default class Report extends BaseModelCreatedUpdated {
  date!: Date;
  name!: string; // max length 255
  lab!: string; // max length 255
  comment!: string; // max length 32767

  static new(id: UUID, date: Date, name: string, lab: string, comment: string, createdBy: UUID): Report {
    const ret = new Report();
    ret.id = id;
    ret.date = date;
    ret.name = name;
    ret.lab = lab;
    ret.comment = comment;
    ret.createdBy = createdBy;
    ret.updatedBy = createdBy;
    return ret;
  }

  static override get tableName(): string {
    return 'reports';
  }

  static override get jsonSchemaWithReferences(): JSONSchema {
    return mergeDeep({}, super.jsonSchemaWithReferences, {
      $id: 'Report',
      required: ['date', 'name', 'lab', 'comment'],

      properties: {
        date: {type: 'string', format: 'date-time'},
        name: {type: 'string', maxLength: 255},
        lab: {type: 'string', maxLength: 255},
        comment: {type: 'string', maxLength: 32767},
      },
    });
  }

  static override afterFind(args: StaticHookArguments<Report>): void {
    BaseModelCreatedUpdated.afterFind(args);
    args.result.forEach((user: Report) => {
      user.date = user.date && new Date(user.date);
    });
  }

  override $beforeValidate(jsonSchema: JSONSchema, json: Pojo, opt: ModelOptions): JSONSchema {
    if (['number', 'object'].includes(typeof json.date)) {
      json.date = json.date && new Date(json.date).toISOString() as any;
    }
    return super.$beforeValidate(jsonSchema, json, opt);
  }

  override $set(obj: Pojo): this {
    super.$set(obj);

    if (['number', 'string'].includes(typeof obj.date)) {
      this.date = new Date(obj.date);
    }
    return this;
  }
}