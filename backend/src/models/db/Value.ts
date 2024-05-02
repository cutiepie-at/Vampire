import BaseModelCreatedUpdated from '../../models/db/BaseModelCreatedUpdated';
import {mergeDeep} from '../../util/merge';
import type {JSONSchema, ModelOptions, Pojo, StaticHookArguments} from 'objection';
import type {UUID} from './util';

export default class Value extends BaseModelCreatedUpdated {
  labelId!: UUID;
  date!: Date;
  value!: number;

  static new(id: string, date: Date, labelId: string, value: number, createdBy: string): Value {
    const ret = new Value();
    ret.id = id;
    ret.labelId = labelId;
    ret.date = date;
    ret.value = value;
    ret.createdBy = createdBy;
    ret.updatedBy = createdBy;
    return ret;
  }

  static override get tableName(): string {
    return 'values';
  }

  static override get jsonSchemaWithReferences(): JSONSchema {
    return mergeDeep({}, super.jsonSchemaWithReferences, {
      $id: 'Value',
      required: ['labelId', 'date', 'value'],

      properties: {
        labelId: {type: 'string', format: 'uuid'},
        date: {type: 'string', format: 'date-time'},
        value: {type: 'number'},
      },
    });
  }

  static override afterFind(args: StaticHookArguments<Value>): void {
    BaseModelCreatedUpdated.afterFind(args);
    args.result.forEach((user: Value) => {
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