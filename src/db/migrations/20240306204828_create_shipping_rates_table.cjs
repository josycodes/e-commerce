/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('shipping_rates', function(table) {
        table.increments('id').primary();
        table.string('shipping_location_option');
        table.string('customer_location');
        table.boolean('taxes').defaultTo(true);
        table.boolean('promotional_codes').defaultTo(true);
        table.text('store_address').defaultTo(true);
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('shipping_rates');
};