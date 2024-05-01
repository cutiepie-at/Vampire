import {describe, expect, it} from 'vitest'
import BaseModel from '../BaseModel';

describe('BaseModel model', () => {
  // it('fromJSON/toJSON works', () => {
  //   initGlobals(); //required for validator
  //
  //   const baseModel = new BaseModel();
  //   baseModel.id = randomUUID();
  //   const res = BaseModel.fromJson(baseModel.toJSON());
  //   expect(res).deep.equals(baseModel);
  // });

  it('jsonSchema', () => {
    const res = BaseModel.jsonSchema;
    expect(res).deep.equals({
      $id: 'BaseModel',
      type: 'object',

      definitions: {},
    });
  });
});
