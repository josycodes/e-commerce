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
        table.json('variants');
        table.decimal('sale_price', 10, 2).notNullable();
        table.decimal('cost_price', 10, 2).notNullable();
        table.decimal('profit', 10, 2).notNullable();
        table.integer('stock').notNullable().defaultTo(0);
        table.string('image').nullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('product_variants');
};
