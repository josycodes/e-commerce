const knex = require('knex');
const { Knex } = knex;

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
    return knex.schema.createTable('products', function(table) {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.text('description').notNullable();
        table.boolean('published').defaultTo('true');
        table.json('images').nullable();
        table.string('sku').nullable();
        table.integer('tax_id').nullable();
        table.integer('discount_id').nullable();
        table.json('tags').nullable();
        table.string('measuring_unit').nullable();
        table.integer('shipping_id').nullable();
        table.timestamps(true, true); // Add 'created_at' and 'updated_at' columns
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('products');
};
