const knex = require('knex');
const { Knex } = knex;

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
    return knex.schema.createTable('shipping_addresses', function(table) {
        table.increments('id').primary();
        table.integer('user_id').references('id').inTable('users');
        table.text('address_line_1').notNullable();
        table.text('address_line_2').notNullable();
        table.text('city').notNullable();
        table.text('state').notNullable();
        table.text('postal_code').notNullable();
        table.text('country').notNullable();
        table.timestamps(true, true); // Add 'created_at' and 'updated_at' columns
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('shipping_addresses');
};
