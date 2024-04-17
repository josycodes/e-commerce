/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('taxes', function(table) {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.string('tax_type').notNullable();
        table.integer('value').notNullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('taxes');
};
