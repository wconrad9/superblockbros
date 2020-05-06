/* eslint-disable no-console */
/* eslint no-unused-vars: ["error", { "args": "none" }] */
const cors = require("cors");
const express = require("express");

const bodyParser = require("body-parser");
const path = require("path"); // eslint-disable-line global-require

const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[process.env.NODE_ENV || "development"]);

const { Model } = require("objection");
const Game = require("./models/Game");

// Bind all Models to a knex instance.
Model.knex(knex);

// Resolve client build directory as absolute path to avoid errors in express
const prodPath = path.resolve(__dirname, "../client/build");
const devPath = path.resolve(__dirname, "../client/development_build/2");

// db-errors provides a consistent wrapper around database errors
const { wrapError, DBError } = require("db-errors");

const app = express();

// Cross-Origin-Resource-Sharing headers tell the browser is OK for this page to request resources
// from another domain (which is otherwise prohibited as a security mechanism)

const corsOptions = {
  methods: ["GET", "PUT", "POST", "DELETE"],
  origin: "*",
  allowedHeaders: ["Content-Type", "Accept", "X-Requested-With", "Origin"]
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  // Serve any static files as first priority
  app.use(express.static(prodPath));
}

app.use(express.static(devPath));

// TODO: Add any middleware here

// TODO: Add your routes here

// Notice the "next" argument to the handler
app.get("/api/games", (request, response, next) => {
  Game.query().then(game => {
    response.send(game);
  }, next); // <- Notice the "next" function as the rejection handler
});

// get a game to execute a join
app.get("/api/games/:id", (request, response, next) => {
  /*
  const { id } = request.body;

  // request.params.id is a string, and so needs to be converted to an integer before comparison
  if (id !== parseInt(request.params.id, 10)) {
    throw new ValidationError({
      statusCode: 400,
      message: 'URL id and request id do not match',
    });
  }
  */

  Game.query()
    .findById(request.params.id)
    .then(game => {
      response.send(game);
    }, next); // <- Notice the "next" function as the rejection handler
});

app.post("/api/games", (request, response, next) => {
  Game.query()
    .insertAndFetch(request.body)
    .then(game => {
      response.send(game);
    }, next);
});

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

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  // All remaining requests return the React app, so it can handle routing.
  app.get("*", (request, response) => {
    response.sendFile(path.join(prodPath, "index.html"));
  });
}

module.exports = {
  app,
  knex
};
