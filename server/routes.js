const express = require("express");
const path = require("path"); // eslint-disable-line global-require

// const cors = require("cors");
const bodyParser = require("body-parser");
const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[process.env.NODE_ENV || "development"]);
const { Model } = require("objection");
const Game = require("./models/Game");

// Bind all Models to a knex instance.
Model.knex(knex);

// db-errors provides a consistent wrapper around database errors
const { wrapError, DBError } = require("db-errors");

// Resolve client build directory as absolute path to avoid errors in express
const buildPath1 = path.resolve(__dirname, "../client/build");
const buildPath2 = path.resolve(__dirname, "./render_level");

const app = express();

// Cross-Origin-Resource-Sharing headers tell the browser is OK for this page to request resources
// from another domain (which is otherwise prohibited as a security mechanism)

/*
const corsOptions = {
  methods: ["GET", "PUT", "POST", "DELETE"],
  origin: "*",
  allowedHeaders: ["Content-Type", "Accept", "X-Requested-With", "Origin"]
};
*/

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  // Serve any static files as first priority
  app.use(express.static(buildPath1));
}

app.use(express.static(buildPath2));

// app.use(cors(corsOptions));
app.use(bodyParser.json());

const games = {}; // Create in memory storage of the articles

// TODO: Add any middleware here

// TODO: Add your routes here

app.post("/api/games", (request, response, next) => {
  const nextId =
    1 +
    Object.values(games).reduce((maxId, game) => Math.max(maxId, game.id), 0);
  games[nextId] = { ...request.body, id: nextId };

  Game.query()
    .insertAndFetch(request.body)
    .then(game => {
      response.send(game);
    }, next);
});

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  // All remaining requests return the React app, so it can handle routing.
  app.get("*", (request, response) => {
    response.sendFile(path.join(buildPath1, "index.html"));
  });
}

// A very simple error handler. In a production setting you would
// not want to send information about the inner workings of your
// application or database to the client.
app.use((error, request, response, next) => {
  if (response.headersSent) {
    next(error);
  }
  const wrappedError = wrapError(error);
  if (wrappedError instanceof DBError) {
    response.status(400).send(wrappedError.data || wrappedError.message || {});
  } else {
    response
      .status(wrappedError.statusCode || wrappedError.status || 500)
      .send(wrappedError.data || wrappedError.message || {});
  }
});

module.exports = {
  app
};
