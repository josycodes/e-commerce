
const knex = require('knex');
const { Knex } = knex;
/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
    return knex.schema.createTable('product_variants', function(table) {
        table.increments('id').primary();
        table.integer('product_id').unsigned().notNullable().references('id').inTable('products');
        table.string('color').nullable();
        table.string('size').nullable();
        table.decimal('price', 10, 2).notNullable();
        table.integer('stock').notNullable().defaultTo(0);
        table.timestamps(true, true); // Add 'created_at' and 'updated_at' columns
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('product_variants');
};
