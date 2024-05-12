import BaseModelCreatedUpdated from '../../models/db/BaseModelCreatedUpdated';
import {mergeDeep} from '../../util/merge';
import type {JSONSchema} from 'objection';
import type {UUID} from './util';

export default class Value extends BaseModelCreatedUpdated {
  reportId!: UUID;
  labelId!: UUID;
  value!: number;

  static new(id: string, reportId: UUID, labelId: UUID, value: number, createdBy: string): Value {
    const ret = new Value();
    ret.id = id;
    ret.reportId = reportId;
    ret.labelId = labelId;
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
      required: ['reportId', 'labelId', 'value'],

      properties: {
        reportId: {type: 'string', format: 'uuid'},
        labelId: {type: 'string', format: 'uuid'},
        value: {type: 'number'},
      },
    });
  }
}