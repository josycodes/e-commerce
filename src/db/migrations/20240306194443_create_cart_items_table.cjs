const knex = require('knex');
const { Knex } = knex;
/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
    return knex.schema.createTable('cart_items', function(table) {
        table.increments('id').primary();
        table.integer('product_id').unsigned().references('id').inTable('products');
        table.integer('user_id').unsigned().references('id').inTable('users');
        table.integer('product_variant_id').references('id').inTable('product_variants');
        table.integer('quantity').notNullable().defaultTo(1);
        table.timestamps(true, true); // Add 'created_at' and 'updated_at' columns
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('cart_items');
};
