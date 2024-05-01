import BaseModel from '$/models/db/BaseModel';
import {mergeDeep} from '$/util/merge';
import type {JSONSchema} from 'objection';

export class LogoutResponse extends BaseModel {
  success!: boolean;
  message?: string;

  static SUCCESS = new LogoutResponse(true);

  constructor(success: boolean, message?: string) {
    super();
    this.success = success;
    this.message = message;
  }

  static get jsonSchemaWithReferences(): JSONSchema {
    return mergeDeep({}, super.jsonSchemaWithReferences, {
      $id: 'LogoutResponse',
      type: 'object',
      required: ['success'],

      properties: {
        success: {type: 'boolean'},
        message: {type: 'string'},
      },
    });
  }
}