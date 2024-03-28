/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('promotions', function(table) {
        table.increments('id').primary();
        table.string('code');
        table.string('discount_type');
        table.integer('amount');
        table.integer('minimum_spend');
        table.integer('maximum_spend');
        table.text('description');
        table.boolean('status').defaultTo(true);
        table.boolean('free_shipping').defaultTo(true);
        table.timestamp('commence_date');
        table.timestamp('expiry_date');
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('promotional_codes');
};
