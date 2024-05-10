import type {Knex} from 'knex';
import * as M20230114134301_user from './20230114134301_user';
import * as M20230610151046_userEmailAndDisplayName from './20230610151046_userEmailAndDisplayName';
import * as M20240501100029_labelAndValues from './20240501100029_labelAndValues';
import * as M20240510192438_cascadeValues from './20240510192438_cascadeValues';

export type Migration = {
  name: string,
  migration: { up: (knex: Knex) => Promise<void>, down: (knex: Knex) => Promise<void> }
};

export const Migrations: Migration[] = [
  {name: '20230114134301_user', migration: M20230114134301_user},
  {name: '20230610151046_userEmailAndDisplayName', migration: M20230610151046_userEmailAndDisplayName},
  {name: '20240501100029_labelAndValues', migration: M20240501100029_labelAndValues},
  {name: '20240510192438_cascadeValues', migration: M20240510192438_cascadeValues},
];
//TODO use glob import