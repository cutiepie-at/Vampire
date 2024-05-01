import BaseModel from './BaseModel';
import type {JSONSchema} from 'objection';
import {mergeDeep} from '$/util/merge';
import type {UUID} from '$/models/db/util';

export default abstract class BaseModelId extends BaseModel {
  id!: UUID;

  static get jsonSchemaWithReferences(): JSONSchema {
    return mergeDeep({}, super.jsonSchemaWithReferences, {
      $id: 'BaseModelId',
      type: 'object',
      required: ['id'],

      properties: {
        id: {type: 'string', format: 'uuid'}, //uuid
      },
    });
  }
}