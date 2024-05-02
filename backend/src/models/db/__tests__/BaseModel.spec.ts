import {describe, expect, test} from '@jest/globals';
import BaseModel from '../BaseModel';

describe('BaseModel model', () => {
  // test('fromJSON/toJSON works', () => {
  //   initGlobals(); //required for validator
  //
  //   const baseModel = new BaseModel();
  //   baseModel.id = randomUUID();
  //   const res = BaseModel.fromJson(baseModel.toJSON());
  //   expect(res).toBe(baseModel);
  // });

  test('jsonSchema', () => {
    const res = BaseModel.jsonSchema;
    expect(res).toBe({
      $id: 'BaseModel',
      type: 'object',

      definitions: {},
    });
  });
});
