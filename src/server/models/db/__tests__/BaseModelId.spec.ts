import {describe, expect, it} from 'vitest';
import BaseModelId from '$/models/db/BaseModelId';

describe('BaseModelId model', () => {
  // it('fromJSON/toJSON works', () => {
  //   initGlobals(); //required for validator
  //
  //   const baseModelId = new BaseModelId();
  //   baseModelId.id = randomUUID();
  //   const res = BaseModelId.fromJson(baseModelId.toJSON());
  //   expect(res).deep.equals(baseModelId);
  // });

  it('jsonSchema', () => {
    const res = BaseModelId.jsonSchema;
    expect(res).deep.equals({
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
