/* eslint-disable func-names */
exports.up = function(knex) {
  return knex.schema.createTable("Games", table => {
    table.increments("id").primary();
    table.string("hostUsername").notNullable();
    table
      .integer("uniqueId")
      .unique()
      .notNullable();
    table.integer("numberOfPlayers");
    table.text("players");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("Games");
};
