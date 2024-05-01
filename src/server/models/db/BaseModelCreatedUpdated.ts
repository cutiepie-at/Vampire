import type {JSONSchema, ModelOptions, Pojo, StaticHookArguments} from 'objection';
import {mergeDeep} from '$/util/merge';
import BaseModelId from '$/models/db/BaseModelId';

export default abstract class BaseModelCreatedUpdated extends BaseModelId {
  createdAt!: Date;
  createdBy!: string; //User.id
  updatedAt!: Date;
  updatedBy!: string; //User.id

  static get jsonSchemaWithReferences(): JSONSchema {
    return mergeDeep({}, super.jsonSchemaWithReferences, {
      $id: 'BaseModelCreatedUpdated',
      required: ['createdAt', 'createdBy', 'updatedAt', 'updatedBy'],

      properties: {
        createdAt: {type: 'string', format: 'date-time'},
        createdBy: {type: 'string', format: 'uuid'}, //User.id
        updatedAt: {type: 'string', format: 'date-time'},
        updatedBy: {type: 'string', format: 'uuid'}, //User.id
      },
    });
  }

  $beforeInsert(): void {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  $beforeUpdate(): void {
    this.updatedAt = new Date();
  }

  static afterFind(args: StaticHookArguments<BaseModelCreatedUpdated>): void {
    args.result.forEach((user: BaseModelCreatedUpdated) => {
      user.createdAt = user.createdAt && new Date(user.createdAt);
      user.updatedAt = user.updatedAt && new Date(user.updatedAt);
    });
  }

  $beforeValidate(jsonSchema: JSONSchema, json: Pojo, opt: ModelOptions): JSONSchema {
    if (['number', 'object'].includes(typeof json.createdAt)) {
      json.createdAt = json.createdAt && new Date(json.createdAt).toISOString() as any;
    }
    if (['number', 'object'].includes(typeof json.updatedAt)) {
      json.updatedAt = json.updatedAt && new Date(json.updatedAt).toISOString() as any;
    }
    return super.$beforeValidate(jsonSchema, json, opt);
  }

  $set(obj: Pojo): this {
    super.$set(obj);

    if (['number', 'string'].includes(typeof obj.createdAt)) {
      this.createdAt = new Date(obj.createdAt);
    }
    if (['number', 'string'].includes(typeof obj.updatedAt)) {
      this.updatedAt = new Date(obj.updatedAt);
    }
    return this;
  }
}