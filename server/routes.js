const express = require("express");
const path = require("path"); // eslint-disable-line global-require

const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[process.env.NODE_ENV || "development"]);

const { Model } = require("objection");
const Game = require("./models/Game");

// Bind all Models to a knex instance.
Model.knex(knex);

// Resolve client build directory as absolute path to avoid errors in express
const prodPath = path.resolve(__dirname, "../client/build");
const devPath = path.resolve(__dirname, "../client/development_build/1");

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
  app.use(express.static(prodPath));
}

app.use(express.static(devPath));

// app.use(cors(corsOptions));

// TODO: Add any middleware here

// TODO: Add your routes here

// Notice the "next" argument to the handler
app.get("/api/games", (request, response, next) => {
  Game.query().then(game => {
    response.send(game);
  }, next); // <- Notice the "next" function as the rejection handler
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
