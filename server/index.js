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
    // console.log("joinRoom message received");
    socket.join(joinRoomRequest.id);
  });

  socket.on("roomCheckRequest", roomCheckRequest => {
    // console.log("roomCheck message received");
    const roomCheckResponse = io.sockets.adapter.rooms[roomCheckRequest.id];
    socket.emit("roomCheckResponse", roomCheckResponse);
  });

  socket.on("gameStartedRequest", gameStartedRequest => {
    const fwdedGameStartedRequest = { ...gameStartedRequest };
    // check if the game in the requested room has already started
    socket
      .to(fwdedGameStartedRequest.roomId)
      .emit("gameStartedRequest", fwdedGameStartedRequest);
  });

  socket.on("gameStartedResponse", gameStartedResponse => {
    const fwdedGameStartedResponse = { ...gameStartedResponse };
    // fwd response to the client who initially made the request
    socket
      .to(fwdedGameStartedResponse.sockId)
      .emit("gameStartedResponse", fwdedGameStartedResponse);
  });

  socket.on("startRaceRequest", startRaceRequest => {
    // console.log("startRaceRequest received");
    const startRaceResponse = { ...startRaceRequest };
    socket
      .to(startRaceRequest.roomId)
      .emit("startRaceResponse", startRaceResponse);
  });

  socket.on("leaveRoomRequest", leaveRoomRequest => {
    // console.log("leaveRoom message received");
    socket.leave(leaveRoomRequest.id);
  });

  socket.on("playerData", playerData => {
    const updatedPlayerData = { ...playerData };
    updatedPlayerData.id = socket.id; // to get a unique identifier for each player
    socket.to(playerData.roomId).emit("playerData", updatedPlayerData);
  });

  socket.on("platformData", platformData => {
    const platformDataCopy = { ...platformData };
    socket.to(platformData.roomId).emit("platformData", platformDataCopy);
  });

  socket.on("checkConnections", playerConnections => {
    // const currentConnections = { ...playerConnections };
    const currentConnections = {
      player2_connected: false,
      player3_connected: false,
      player4_connected: false
    };
    const roomObj = io.sockets.adapter.rooms[playerConnections.roomId];
    if (roomObj) {
      const player2Socket = playerConnections.player2_sockId;
      const player3Socket = playerConnections.player3_sockId;
      const player4Socket = playerConnections.player4_sockId;
      const socketListObj = roomObj.sockets;
      const sockIdArray = Object.keys(socketListObj);
      currentConnections.player2_connected = sockIdArray.includes(
        player2Socket
      );
      currentConnections.player3_connected = sockIdArray.includes(
        player3Socket
      );
      currentConnections.player4_connected = sockIdArray.includes(
        player4Socket
      );
    }
    // console.log(currentConnections);
    socket.emit("currentConnections", currentConnections);
  });

  socket.on("winMsg", winnerInfo => {
    socket.to(winnerInfo.roomId).emit("winMsg", winnerInfo);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
