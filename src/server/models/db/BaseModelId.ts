import BaseModel from './BaseModel';
import type {JSONSchema} from 'objection';
import {mergeDeep} from '$/util/merge';

export default abstract class BaseModelId extends BaseModel {
  id!: string;//uuid

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