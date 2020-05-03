/* eslint-disable arrow-body-style */
const request = require("supertest");
const { app, knex } = require("./routes");

const game = {
  username: "wally"
};

describe("Games API", () => {
  beforeEach(() => {
    return knex.migrate
      .rollback()
      .then(() => knex.migrate.latest())
      .then(() => knex.seed.run());
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });

  test("GET /api/games should return all games", () => {
    return request(app)
      .get("/api/games")
      .expect(200)
      .expect("Content-Type", /json/)
      .expect([{ id: 1, ...game }]);
  });
});
