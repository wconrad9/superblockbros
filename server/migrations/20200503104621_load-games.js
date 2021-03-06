/* eslint-disable func-names */
exports.up = function(knex) {
  return knex.schema.createTable("Games", table => {
    table.increments("id").primary();
    table.string("username").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("Games");
};
