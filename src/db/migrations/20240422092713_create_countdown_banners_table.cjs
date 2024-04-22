/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('countdown_banners', function(table) {
        table.increments('id').primary();
        table.string('main_text');
        table.string('caption');
        table.string('status');
        table.datetime('start_date');
        table.datetime('end_date');
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('countdown_banners');
};
