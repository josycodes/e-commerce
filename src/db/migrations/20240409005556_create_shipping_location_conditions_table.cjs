/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('shipping_location_conditions', function(table) {
        table.increments('id').primary();
        table.integer('shipping_method_id').references('id').inTable('shipping_methods');
        table.integer('charge');
        table.string('condition');
        table.string('condition_sign');
        table.integer('count');
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('shipping_location_conditions');
};
