import BaseModelCreatedUpdated from '$/models/db/BaseModelCreatedUpdated';
import {mergeDeep} from '$/util/merge';
import type {JSONSchema} from 'objection';

export default class Label extends BaseModelCreatedUpdated {
  name!: string; //max length 255, unique with createdBy
  description!: string; //max length 32767
  unit!: string; //max length 32
  color!: string; //max length 32
  minReference!: number;
  maxReference!: number;

  static new(id: string, name: string, description: string, unit: string, color: string,
             minReference: number, maxReference: number, createdBy: string): Label {
    const ret = new Label();
    ret.id = id;
    ret.name = name;
    ret.description = description;
    ret.unit = unit;
    ret.color = color;
    ret.minReference = minReference;
    ret.maxReference = maxReference;
    ret.createdBy = createdBy;
    ret.updatedBy = createdBy;
    return ret;
  }

  static get tableName(): string {
    return 'labels';
  }

  static get jsonSchemaWithReferences(): JSONSchema {
    return mergeDeep({}, super.jsonSchemaWithReferences, {
      $id: 'Label',
      required: ['name', 'description', 'unit', 'color', 'minReference', 'maxReference'],

      properties: {
        name: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        description: {type: 'string', maxLength: 32767}, //max length 32767
        unit: {type: 'string', maxLength: 32}, //max length 32
        color: {type: 'string', maxLength: 32}, //max length 32
        minReference: {type: 'number'},
        maxReference: {type: 'number'},
      },
    });
  }
}