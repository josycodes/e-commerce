/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('banners', function(table) {
        table.increments('id').primary();
        table.string('title');
        table.string('title_text');
        table.string('image');
        table.integer('charge');
        table.datetime('end_date');
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('banners');
};
