/* eslint-disable no-console */
const http = require("http");
const { app } = require("./routes");
const socketIo = require("socket.io");

const server = http.createServer(app).listen(process.env.PORT || 3001);
console.log("Listening on port %d", server.address().port); // eslint-disable-line no-console

const io = socketIo(server);

io.sockets.on("connection", socket => {
  console.log(`New connection -- socket id: ${socket.id}`); // eslint-disable-line no-console

  socket.on("joinRoom", joinRoomRequest => {
    socket.join(joinRoomRequest.id);
  });

  socket.on("playerPosition", playerPositionData => {
    const updatedPlayerPositionData = { ...playerPositionData };
    updatedPlayerPositionData.id = socket.id;
    socket
      .to(playerPositionData.roomId)
      .emit("playerPosition", updatedPlayerPositionData);
  });
});
