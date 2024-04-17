const knex = require('knex');
const { Knex } = knex;

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
    return knex.schema.createTable('categories', function(table) {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('slug').nullable();
        table.text('description').nullable();
        table.boolean('status').defaultTo(true);
        table.string('image').nullable();
        table.timestamps(true, true); // Add 'created_at' and 'updated_at' columns
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('categories');
};
