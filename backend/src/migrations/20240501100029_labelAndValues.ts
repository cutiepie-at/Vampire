import type {Knex} from 'knex';
import {createdAndUpdatedFields} from './_util';


export async function up(knex: Knex): Promise<void> {
  console.log('Running migration 20240501100029_labelAndValues');

  await knex.transaction(async trx => {
    await knex.schema.createTable('labels', table => {
      table.uuid('id').primary();
      table.string('name', 255).notNullable();
      table.string('description', 32767).notNullable();
      table.string('unit', 32).notNullable();
      table.string('color', 32).notNullable();
      table.float('minReference', 32).notNullable();
      table.float('maxReference', 32).notNullable();
      createdAndUpdatedFields(table);
      table.unique(['name', 'createdBy'], {indexName: 'U_labels_name_createdBy'});
    }).transacting(trx);
    await knex.schema.createTable('values', table => {
      table.uuid('id').primary();
      table.uuid('labelId').notNullable().references('id').inTable('labels').onUpdate('RESTRICT').onDelete('RESTRICT');
      table.datetime('date', {useTz: false}).notNullable();
      table.float('value', 32).notNullable();
      createdAndUpdatedFields(table);
    }).transacting(trx);
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.transaction(async trx => {
    await knex.schema.dropTable('values').transacting(trx);
    await knex.schema.dropTable('labels').transacting(trx);
  });
}

