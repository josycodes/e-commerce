/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('discounts', function(table) {
        table.increments('id').primary();
        table.string('title');
        table.string('discount_type');
        table.integer('value');
        table.string('code').nullable();
        table.text('description').nullable();
        table.integer('minimum_order_amount').nullable();
        table.integer('maximum_customer_use').nullable();
        table.integer('maximum_claims').nullable();
        table.boolean('status').defaultTo(true);
        table.boolean('free_shipping').nullable();
        table.timestamp('start_date').nullable();
        table.timestamp('end_date').nullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('discounts');
};
