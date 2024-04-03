/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('product_discounts', function(table) {
        table.increments('id').primary();
        table.integer('product_id').unsigned().notNullable().references('id').inTable('products');
        table.integer('discount_id').unsigned().notNullable().references('id').inTable('discounts');
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('product_discounts');
};
