import type {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  console.log('Running migration 20240510192438_cascadeValues');

  await knex.transaction(async trx => {
    await knex.schema.alterTable('values', table => {
      table.dropForeign('labelId')
      table.uuid('labelId').notNullable().references('id').inTable('labels').onUpdate('RESTRICT').onDelete('CASCADE').alter();
    }).transacting(trx);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.transaction(async trx => {
    await knex.schema.alterTable('values', table => {
      table.dropForeign('labelId')
      table.uuid('labelId').notNullable().references('id').inTable('labels').onUpdate('RESTRICT').onDelete('RESTRICT').alter();
    }).transacting(trx);
  });
}

