/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('banners', function(table) {
        table.increments('id').primary();
        table.string('banner_type').defaultTo('main');
        table.string('desktop_image');
        table.string('tablet_image');
        table.string('mobile_image');
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
