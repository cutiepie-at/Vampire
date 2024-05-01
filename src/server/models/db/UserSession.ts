import type {SessionData} from 'express-session';
import type {JSONSchema, ModelOptions, Pojo, StaticHookArguments} from 'objection';
import BaseModelId from '$/models/db/BaseModelId';
import {mergeDeep} from '$/util/merge';
import type {UUID} from '$/models/db/util';

export default class UserSession extends BaseModelId {
  userId?: UUID;
  expires!: Date;
  data?: SessionData;//json

  static new(id: string, userId?: string): UserSession {
    const ret = new UserSession();
    ret.id = id;
    ret.userId = userId;
    ret.expires = new Date();
    ret.data = undefined;
    return ret;
  }

  static get tableName(): string {
    return 'usersessions';
  }

  static get jsonAttributes(): string[] {
    return ['data'];
  }

  static get jsonSchemaWithReferences(): JSONSchema {
    return mergeDeep({}, super.jsonSchemaWithReferences, {
      $id: 'UserSession',
      type: 'object',
      required: ['userId', 'expires', 'data'],

      properties: {
        userId: {type: 'string', format: 'uuid', nullable: true},//uuid
        expires: {type: 'string', format: 'date-time'},
        data: {type: 'object', nullable: true},
      },
    });
  }

  static afterFind(args: StaticHookArguments<UserSession>): void {
    args.result.forEach((session: UserSession) => {
      session.expires = session.expires && new Date(session.expires);
    });
  }

  $beforeValidate(jsonSchema: JSONSchema, json: Pojo, opt: ModelOptions): JSONSchema {
    if (['number', 'object'].includes(typeof json.expires)) {
      json.expires = json.expires && new Date(json.expires).toISOString() as any;
    }
    return super.$beforeValidate(jsonSchema, json, opt);
  }

  $set(obj: Pojo): this {
    super.$set(obj);

    if (['number', 'string'].includes(typeof obj.expires)) {
      this.expires = new Date(obj.expires);
    }
    return this;
  }
}