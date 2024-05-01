import {describe, expect, it} from 'vitest';
import BaseModelCreatedUpdated from '../BaseModelCreatedUpdated';

describe('BaseModelCreatedUpdated model', () => {
  // it('fromJSON/toJSON works', () => {
  //   initGlobals(); //required for validator
  //
  //   const baseModel = new BaseModelCreatedUpdated();
  //   baseModel.id = randomUUID();
  //   baseModel.createdAt = new Date();
  //   baseModel.createdBy = randomUUID();
  //   baseModel.updatedAt = new Date();
  //   baseModel.updatedBy = randomUUID();
  //   const res = BaseModelCreatedUpdated.fromJson(baseModel.toJSON());
  //   expect(res).deep.equals(baseModel);
  // });

  it('jsonSchema', () => {
    const res = BaseModelCreatedUpdated.jsonSchema;
    expect(res).deep.equals({
      $id: 'BaseModelCreatedUpdated',
      type: 'object',
      required: ['id', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy'],

      properties: {
        id: {type: 'string', format: 'uuid'},
        createdAt: {type: 'string', format: 'date-time'},
        createdBy: {type: 'string', format: 'uuid'},
        updatedAt: {type: 'string', format: 'date-time'},
        updatedBy: {type: 'string', format: 'uuid'},
      },

      definitions: {},
    });
  });
});
