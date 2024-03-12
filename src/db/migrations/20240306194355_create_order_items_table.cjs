const knex = require('knex');
const { Knex } = knex;
/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
    return knex.schema.createTable('orders_items', function(table) {
        table.increments('id').primary();
        table.integer('order_id').references('id').inTable('orders');
        table.integer('product_id').references('id').inTable('products');
        table.json('variant_id').unsigned();
        table.integer('quantity').notNullable().defaultTo(1);
        table.decimal('amount', 10, 2).notNullable();
        table.timestamps(true, true); // Add 'created_at' and 'updated_at' columns
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('order_items');
};
