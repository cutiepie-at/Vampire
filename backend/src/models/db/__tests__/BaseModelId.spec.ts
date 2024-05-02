import {describe, expect, test} from '@jest/globals';
import BaseModelId from '../BaseModelId';

describe('BaseModelId model', () => {
  // test('fromJSON/toJSON works', () => {
  //   initGlobals(); //required for validator
  //
  //   const baseModelId = new BaseModelId();
  //   baseModelId.id = randomUUID();
  //   const res = BaseModelId.fromJson(baseModelId.toJSON());
  //   expect(res).toBe(baseModelId);
  // });

  test('jsonSchema', () => {
    const res = BaseModelId.jsonSchema;
    expect(res).toBe({
      $id: 'BaseModelId',
      type: 'object',
      required: ['id'],

      properties: {
        id: {type: 'string', format: 'uuid'},
      },

      definitions: {},
    });
  });
});
