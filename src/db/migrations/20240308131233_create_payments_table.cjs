const knex = require('knex');
const { Knex } = knex;

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
    return knex.schema.createTable('payments', function(table) {
        table.increments('id').primary();
        table.integer('stripe_payment_id').notNullable();
        table.decimal('amount', 10, 2).notNullable();
        table.integer('order_id').notNullable().references('id').inTable('orders');
        table.string('status').notNullable().defaultTo('pending');
        table.timestamps(true, true); // Add 'created_at' and 'updated_at' columns
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('payments');
};
