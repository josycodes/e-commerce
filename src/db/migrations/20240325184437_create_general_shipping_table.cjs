/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('general_shipping', function(table) {
        table.increments('id').primary();
        table.integer('country_id').references('id').inTable('countries');
        table.string('country');
        table.string('state');
        table.string('city');
        table.string('zip_code');
        table.boolean('taxes').defaultTo(true);
        table.boolean('payment_on_delivery').defaultTo(true);
        table.boolean('discount').defaultTo(true);
        table.text('store_address');
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('general_shipping');
};
