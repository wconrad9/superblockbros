const express = require("express");
const path = require("path"); // eslint-disable-line global-require

// Resolve client build directory as absolute path to avoid errors in express
const buildPath1 = path.resolve(__dirname, "../client/build");
const buildPath2 = path.resolve(__dirname, "./render_level");

const app = express();

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  // Serve any static files as first priority
  app.use(express.static(buildPath1));
}

app.use(express.static(buildPath2));

// TODO: Add any middleware here

// TODO: Add your routes here

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  // All remaining requests return the React app, so it can handle routing.
  app.get("*", (request, response) => {
    response.sendFile(path.join(buildPath1, "index.html"));
  });
}

module.exports = {
  app
};
