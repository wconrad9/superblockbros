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
    console.log("joinRoom message received");
    socket.join(joinRoomRequest.id);
  });

  socket.on("roomCheckRequest", roomCheckRequest => {
    console.log("roomCheck message received");
    const roomCheckResponse = io.sockets.adapter.rooms[roomCheckRequest.id];
    socket.emit("roomCheckResponse", roomCheckResponse);
  });

  socket.on("startRaceRequest", startRaceRequest => {
    console.log("startRaceRequest received");
    const startRaceResponse = { ...startRaceRequest };
    socket
      .to(startRaceRequest.roomId)
      .emit("startRaceResponse", startRaceResponse);
  });

  socket.on("leaveRoomRequest", leaveRoomRequest => {
    console.log("leaveRoom message received");
    socket.leave(leaveRoomRequest.id);
  });

  socket.on("playerPosition", playerPositionData => {
    const updatedPlayerPositionData = { ...playerPositionData };
    updatedPlayerPositionData.id = socket.id;
    socket
      .to(playerPositionData.roomId)
      .emit("playerPosition", updatedPlayerPositionData);
  });

  socket.on("winMsg", winnerInfo => {
    socket.to(winnerInfo.roomId).emit("winMsg", winnerInfo);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
