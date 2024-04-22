/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('category_banners', function(table) {
        table.increments('id').primary();
        table.integer('category_id');
        table.integer('pricing');
        table.string('image');
        table.string('status');
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('category_banners');
};
