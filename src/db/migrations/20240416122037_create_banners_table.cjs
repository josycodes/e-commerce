/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('banners', function(table) {
        table.increments('id').primary();
        table.string('banner_type').defaultTo('main');
        table.string('main_text');
        table.string('caption');
        table.string('image');
        table.string('button_label').nullable();
        table.integer('charge').nullable();
        table.string('status').defaultTo('active');
        table.string('link').nullable();
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
