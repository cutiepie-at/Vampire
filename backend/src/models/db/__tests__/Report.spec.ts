import {describe, expect, test} from '@jest/globals';
import {initGlobals} from '../../../util/GlobalInit';
import Report from '../Report';
import {randomUUID} from 'crypto';
import {randomString} from '../../../util/string';

describe('BaseModelCreatedUpdated model', () => {
  test('fromJSON/toJSON works', () => {
    initGlobals(); //required for validator

    const report = new Report();
    report.id = randomUUID();
    report.createdAt = new Date();
    report.createdBy = randomUUID();
    report.updatedAt = new Date();
    report.updatedBy = randomUUID();
    report.date = new Date();
    report.name = randomString(10);
    report.lab = randomString(10);
    report.comment = randomString(10);
    const res = Report.fromJson(report.toJSON());
    expect(res).toStrictEqual(report);
  });

  test('jsonSchema', () => {
    const res = Report.jsonSchema;
    expect(res).toStrictEqual({
      $id: 'Report',
      type: 'object',
      required: ['id', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy', 'date', 'name', 'lab', 'comment'],

      properties: {
        id: {type: 'string', format: 'uuid'},
        createdAt: {type: 'string', format: 'date-time'},
        createdBy: {type: 'string', format: 'uuid'},
        updatedAt: {type: 'string', format: 'date-time'},
        updatedBy: {type: 'string', format: 'uuid'},
        date: {type: 'string', format: 'date-time'},
        name: {type: 'string', maxLength: 255},
        lab: {type: 'string', maxLength: 255},
        comment: {type: 'string', maxLength: 32767},
      },

      definitions: {},
    });
  });
});
