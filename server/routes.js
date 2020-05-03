const express = require("express");
const path = require("path"); // eslint-disable-line global-require

const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[process.env.NODE_ENV || "development"]);

const { Model, ValidationError } = require("objection");
const Game = require("./models/Game");

// Bind all Models to a knex instance.
Model.knex(knex);

// Resolve client build directory as absolute path to avoid errors in express
const buildPath1 = path.resolve(__dirname, "../client/build");
const buildPath2 = path.resolve(__dirname, "./render_level");

const app = express();

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  // Serve any static files as first priority
  app.use(express.static(buildPath1));
}

//buildpath to the game
app.use(express.static(buildPath2));

// TODO: Add any middleware here

// TODO: Add your routes here

// Notice the "next" argument to the handler
app.get("/api/games", (request, response, next) => {
  Game.query().then(game => {
    response.send(game);
  }, next); // <- Notice the "next" function as the rejection handler
});

app.post("/api/games", (request, response, next) => {
  Game.query()
    .insertAndFetch(request.body)
    .then(article => {
      response.send(article);
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
  app,
  knex
};
