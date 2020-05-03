/* eslint-disable camelcase */
const { Model } = require("objection");

class Game extends Model {
  // Table name is the only required property.
  static get tableName() {
    return "Games";
  }

  // Objection.js assumes primary key is `id` by default

  static get jsonSchema() {
    return {
      type: "object",
      required: ["username"],

      properties: {
        id: { type: "integer" },
        username: { type: "string" }
      }
    };
  }
}

module.exports = Game;
