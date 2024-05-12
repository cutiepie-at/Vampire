import type {Knex} from 'knex';
import {createdAndUpdatedFields} from './_util';
import {randomUUID} from 'crypto';

export async function up(knex: Knex): Promise<void> {
  console.log('Running migration 20240511125408_reports');

  await knex.transaction(async trx => {
    await knex.schema.createTable('reports', table => {
      table.uuid('id').primary();
      table.datetime('date', {useTz: false}).notNullable();
      table.string('name', 255).notNullable();
      table.string('lab', 255).notNullable();
      table.string('comment', 32767).notNullable();
      createdAndUpdatedFields(table);
    }).transacting(trx);

    await knex.schema.alterTable('values', table => {
      table.uuid('reportId').references('id').inTable('reports').onUpdate('RESTRICT').onDelete('CASCADE').after('id');
    }).transacting(trx);

    const values = await knex.select().from('values').transacting(trx);
    const grouped = Map.groupBy(values, value => (value.createdBy + ' ' + value.date));
    for (const entry of grouped.entries()) {
      const split = entry[0].split(' ', 2);
      const createdBy = split[0];
      const date = split[1];
      const report = {
        id: randomUUID(),
        date: date,
        name: '',
        lab: '',
        comment: '',
        createdAt: date,
        createdBy: createdBy,
        updatedAt: date,
        updatedBy: createdBy,
      };
      await knex.insert(report).into('reports').transacting(trx);
      entry[1].forEach(e => e.reportId = report.id);
      for (const val of entry[1]) {
        await knex.update(val).into('values').where('id', val.id).transacting(trx);
      }
    }

    await knex.schema.alterTable('values', table => {
      table.uuid('reportId').notNullable().alter();
      table.dropColumn('date');
    }).transacting(trx);
  });
}

export async function down(knex: Knex): Promise<void> {

  await knex.transaction(async trx => {
    await knex.schema.alterTable('values', table => {
      table.datetime('date', {useTz: false}).alter();
    }).transacting(trx);

    const reports = await knex.select().from('reports').transacting(trx);
    const reportsById = new Map(reports.map(e => [e.id, e]));
    const values = await knex.select().from('values').transacting(trx);
    for (let val of values) {
      val.date = reportsById.get(val.reportId).date;
      await knex.update(val).into('values').where('id', val.id).transacting(trx);
    }

    await knex.schema.alterTable('values', table => {
      table.datetime('date', {useTz: false}).notNullable().alter();
      table.dropForeign('reportId');
      table.dropColumn('reportId');
    }).transacting(trx);

    await knex.schema.dropTable('reports').transacting(trx);
  });
}
