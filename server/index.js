/* eslint-disable no-console */
const http = require("http");
const { app } = require("./routes");
const socketIo = require("socket.io");

const server = http.createServer(app).listen(process.env.PORT || 3001);
console.log("Listening on port %d", server.address().port);

const io = socketIo(server);

io.sockets.on("connection", socket => {
  console.log(socket); // eslint-disable-line no-console
  console.log("New client connected"); // eslint-disable-line no-console
});
