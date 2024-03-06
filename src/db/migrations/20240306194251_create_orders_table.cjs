const knex = require('knex');
const { Knex } = knex;

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
    return knex.schema.createTable('orders', function(table) {
        table.increments('id').primary();
        table.integer('user_id').references('id').inTable('users');
        table.decimal('total_amount', 10, 2).notNullable();
        table.integer('shipping_address_id').references('id').inTable('shipping_addresses');
        table.string('payment_status').notNullable().defaultTo('processing');
        table.timestamps(true, true); // Add 'created_at' and 'updated_at' columns
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('orders');
};
