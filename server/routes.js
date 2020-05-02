const express = require("express");
const path = require("path"); // eslint-disable-line global-require

// Resolve client build directory as absolute path to avoid errors in express
const prodPath = path.resolve(__dirname, "../client/build");
const devPath = path.resolve(__dirname, "../client/development_build/1");

const app = express();

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  // Serve any static files as first priority
  app.use(express.static(prodPath));
}

app.use(express.static(devPath));

// TODO: Add any middleware here

// TODO: Add your routes here

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  // All remaining requests return the React app, so it can handle routing.
  app.get("*", (request, response) => {
    response.sendFile(path.join(prodPath, "index.html"));
  });
}

module.exports = {
  app
};
