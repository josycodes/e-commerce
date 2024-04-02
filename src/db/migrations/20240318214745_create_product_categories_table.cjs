/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('product_categories', function(table) {
        table.increments('id').primary();
        table.integer('product_id').references('id').inTable('products');
        table.integer('category_id').references('id').inTable('categories');
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('product_categories');
};
