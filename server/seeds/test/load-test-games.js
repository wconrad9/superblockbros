/* eslint-disable func-names */
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("Games")
    .del()
    .then(() =>
      // Inserts seed entries
      knex("Games").insert([
        {
          username: "wally"
        }
      ])
    );
};
