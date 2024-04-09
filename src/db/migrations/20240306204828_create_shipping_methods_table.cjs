/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('shipping_methods', function(table) {
        table.increments('id').primary();
        table.string('name');
        table.string('type');
        table.text('description');
        table.boolean('status');
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('shipping_methods');
};
