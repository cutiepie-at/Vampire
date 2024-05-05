import {describe, expect, test} from '@jest/globals';
import {initGlobals} from '../../../util/GlobalInit';
import Value from '../Value';
import {randomUUID} from 'crypto';

describe('BaseModelCreatedUpdated model', () => {
  test('fromJSON/toJSON works', () => {
    initGlobals(); //required for validator

    const value = new Value();
    value.id = randomUUID();
    value.createdAt = new Date();
    value.createdBy = randomUUID();
    value.updatedAt = new Date();
    value.updatedBy = randomUUID();
    value.labelId = randomUUID();
    value.date = new Date();
    value.value = Math.random();
    const res = Value.fromJson(value.toJSON());
    expect(res).toStrictEqual(value);
  });

  test('jsonSchema', () => {
    const res = Value.jsonSchema;
    expect(res).toStrictEqual({
      $id: 'Value',
      type: 'object',
      required: ['id', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy', 'labelId', 'date', 'value'],

      properties: {
        id: {type: 'string', format: 'uuid'},
        createdAt: {type: 'string', format: 'date-time'},
        createdBy: {type: 'string', format: 'uuid'},
        updatedAt: {type: 'string', format: 'date-time'},
        updatedBy: {type: 'string', format: 'uuid'},
        labelId: {type: 'string', format: 'uuid'},
        date: {type: 'string', format: 'date-time'},
        value: {type: 'number'},
      },

      definitions: {},
    });
  });
});
