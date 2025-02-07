/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('sales_location', function(table) {
        table.increments('id').primary();
        table.integer('country_id').references('id').inTable('countries');
        table.string('country');
        table.string('zip_code').nullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('sales_location');
};
