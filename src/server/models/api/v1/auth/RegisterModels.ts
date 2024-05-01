import BaseModel from '$/models/db/BaseModel';
import type UserInfo from '$/models/api/v1/user/UserInfo';
import type UserSessionInfo from '$/models/api/v1/user/UserSessionInfo';
import {mergeDeep} from '$/util/merge';
import type {JSONSchema} from 'objection';

export class RegisterRequest extends BaseModel {
  username!: string;//max length 32
  password!: string;//max length 255

  static get tableName(): string {
    return '';//dummy so that the adj validator doe not complain, TODO don't inherit form objection.Model but use another json validation
  }

  static get jsonSchemaWithReferences(): JSONSchema {
    return mergeDeep({}, super.jsonSchemaWithReferences, {
      $id: 'RegisterRequest',
      type: 'object',
      required: ['username', 'password'],

      properties: {
        username: {type: 'string', maxLength: 32},
        password: {type: 'string'},
      },
    });
  }
}

export class RegisterResponse extends BaseModel {
  success!: boolean;
  user?: UserInfo;
  session?: UserSessionInfo;
  message?: string;

  static REGISTRATION_DISABLED = RegisterResponse.failed('Registration disabled!');//TODO placeholder message
  static USER_ALREADY_EXISTS = RegisterResponse.failed('User already exists!');//TODO placeholder message

  static success(user: UserInfo, session: UserSessionInfo): RegisterResponse {
    const ret = new RegisterResponse();
    ret.success = true;
    ret.user = user;
    ret.session = session;
    return ret;
  }

  static failed(message: string): RegisterResponse {
    const ret = new RegisterResponse();
    ret.success = false;
    ret.message = message;
    return ret;
  }

  static get jsonSchemaWithReferences(): JSONSchema {
    return mergeDeep({}, super.jsonSchemaWithReferences, {
      $id: 'RegisterResponse',
      type: 'object',
      required: ['success'],

      properties: {
        success: {type: 'boolean'},
        user: {'$ref': '#/definitions/UserInfo'},
        session: {'$ref': '#/definitions/UserSessionInfo'},
        message: {type: 'string'},
      },
    });
  }
}