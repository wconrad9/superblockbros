// Frank Poth 08/13/2017
// Add event listener for if page is loaded

window.addEventListener("load", function(event) {
  var context, menuButton, playButton, controller, rectangle, platform, loop;

  context = document.querySelector("canvas").getContext("2d");
  menuButton = document.getElementById("menuButton");
  playButton = document.getElementById("playButton");

  menuButton.disabled = true; // disable menuButton functionality until game ends
  playButton.disabled = true; // disable playButton functionality until at least 2 players exist

  const params = new URLSearchParams(window.location.search); // get query params

  context.canvas.height = 720;
  context.canvas.width = 1280;

  // context.canvas.style.width = "1280px";
  // context.canvas.style.height = "720px";

  platform1 =
  {
  height: 16,
  width: 64,
  x: 144,
  x_velocity: 2,
  y: context.canvas.height - 90,
  y_velocity: 0
  }

  platform2 =
  {
  height: 16,
  width: 64,
  x: context.canvas.width - 144,
  x_velocity: -2,
  y: context.canvas.height - 180,
  y_velocity: 0
  }

  platform3 =
  {
  height: 16,
  width: 64,
  x: 144,
  x_velocity: 2,
  y: context.canvas.height - 270,
  y_velocity: 0
  }

  platform4 =
  {
  height: 16,
  width: 64,
  x: context.canvas.width - 144,
  x_velocity: -2,
  y: context.canvas.height - 360,
  y_velocity: 0
  }

  platform5 =
  {
  height: 16,
  width: 64,
  x: 144,
  x_velocity: 2,
  y: context.canvas.height - 450,
  y_velocity: 0
  }

  platform6 =
  {
  height: 16,
  width: 64,
  x: context.canvas.width - 144,
  x_velocity: -2,
  y: context.canvas.height - 540,
  y_velocity: 0
}

  rectangle =
  {
    height:32,
    jumping:true,
    width:32,
    x:144, // center of canvas (5 would be left end)
    x_velocity:0,
    y:0,
    y_velocity:0
  };

  controller = {

    left:false,
    right:false,
    up:false,
    keyListener:function(event) {

      var key_state = (event.type == "keydown") ? true : false;

      if (event.keyCode == 65 || event.keyCode == 37)
      {
        controller.left = key_state;
      }
      else if (event.keyCode == 32 || event.keyCode == 38 || event.keyCode == 87)
      {
        controller.up = key_state;
      }
      else if (event.keyCode == 39 || event.keyCode == 68)
      {
        controller.right = key_state;
      }
    }
  };

  /* Socket Code: */
  // connect to server via socket
  const socket = io.connect('http://localhost:3001');
  // parse URL and extract queryparameters to enter a specific room
  const joinRoomRequest = {
    id: params.get("id").toString()
  }
  socket.emit("joinRoom", joinRoomRequest);
  // To display Game ID in top-left of screen
  const gameIdString = "Game ID: " + joinRoomRequest.id;

  // get whether this user is host (1) or not (0)
  const isHost = parseInt(params.get("host").toString());

  // Object to hold my player data to send to server
  const myData = {};
  // Object to hold platform data to send to server... will only send if host
  const platform1Data = {};
  const platform2Data = {};
  const platform3Data = {};
  const platform4Data = {};
  const platform5Data = {};
  const platform6Data = {};

  /* Objects to hold other players' positional data received
    from server */
  const playerData_2 = {};
  const playerData_3 = {};
  const playerData_4 = {};
  playerData_2.id = null;
  playerData_3.id = null;
  playerData_4.id = null;

  // Variables for flashing text
  let intSet = false;
  let textPosInt = 25;
  var intervalId = 0;

  // Variables to hold & keep track of current playerCount as well as gameState:
  let playerCount = 1;
  let player2_added = false;
  let player3_added = false;
  let player4_added = false;
  let maxPlayers = 4;

  let connData = {}; // object to keep track of players still connected
  let connEventString = ""; // string to hold message to show when a player connects/disconnects

  let localWinnerInfo = {};

  // get playerName from query parameters in url
  let playerName = params.get("name").toString();

  let startButtonPressed = false;
  let stopWaiting = false; // bool to know when to stop flashing 'waiting for players'
  let beginGame = false;
  let timeToStart = 5;
  let gameStarted = false;
  let endReached = false;
  let youWin = false;
  let youLose = false;
  let sendWinMsg = false;

  //let playersMaxed = false;

  playButton.addEventListener("click", (event) => { // when "Start Game" button is clicked
    // start race by artificially making the code believe that 4 players have joined
    startButtonPressed = true;
    startRaceRequest = {
      roomId: joinRoomRequest.id
    }
    // send start race message to server, which will send it to all other players
    socket.emit("startRaceRequest", startRaceRequest);
  });
  // handle start race message, when received
  socket.on("startRaceResponse", (startRaceResponse) => {
    startButtonPressed = true;
  });
  // add handler for gameStartedRequest messages:
  // if (isHost) // was previously only for host, but this introduced some unforeseen issues
  // {
  socket.on("gameStartedRequest", (gameStartedRequest) => {
    const gameStartedResponse = { ...gameStartedRequest };
    if (startButtonPressed)
    {
      gameStartedResponse.gameStarted = true;
    }
    else
    {
      gameStartedResponse.gameStarted = false;
    }
    socket.emit("gameStartedResponse", gameStartedResponse);
  });
  // }

  loop = function() {

    if (isHost)
    {
      platform1Data.x = platform1.x;
      platform1Data.y = platform1.y;
      platform1Data.platformNo = 1;
      // platform1Data.height = platform1.height;
      // platform1Data.width = platform1.width;
      // platform1Data.x_velocity = platform1.x_velocity;
      // platform1Data.y_velocity = platform1.y_velocity;
      platform1Data.roomId = joinRoomRequest.id;

      platform2Data.x = platform2.x;
      platform2Data.y = platform2.y;
      platform2Data.platformNo = 2;
      // platform2Data.height = platform2.height;
      // platform2Data.width = platform2.width;
      // platform2Data.x_velocity = platform2.x_velocity;
      // platform2Data.y_velocity = platform2.y_velocity;
      platform2Data.roomId = joinRoomRequest.id;

      platform3Data.x = platform3.x;
      platform3Data.y = platform3.y;
      platform3Data.platformNo = 3;
      // platform3Data.height = platform3.height;
      // platform3Data.width = platform3.width;
      // platform3Data.x_velocity = platform3.x_velocity;
      // platform3Data.y_velocity = platform3.y_velocity;
      platform3Data.roomId = joinRoomRequest.id;

      platform4Data.x = platform4.x;
      platform4Data.y = platform4.y;
      platform4Data.platformNo = 4;
      // platform3Data.height = platform3.height;
      // platform3Data.width = platform3.width;
      // platform3Data.x_velocity = platform3.x_velocity;
      // platform3Data.y_velocity = platform3.y_velocity;
      platform4Data.roomId = joinRoomRequest.id;

      platform5Data.x = platform5.x;
      platform5Data.y = platform5.y;
      platform5Data.platformNo = 5;
      // platform3Data.height = platform3.height;
      // platform3Data.width = platform3.width;
      // platform3Data.x_velocity = platform3.x_velocity;
      // platform3Data.y_velocity = platform3.y_velocity;
      platform5Data.roomId = joinRoomRequest.id;

      platform6Data.x = platform6.x;
      platform6Data.y = platform6.y;
      platform6Data.platformNo = 6;
      // platform3Data.height = platform3.height;
      // platform3Data.width = platform3.width;
      // platform3Data.x_velocity = platform3.x_velocity;
      // platform3Data.y_velocity = platform3.y_velocity;
      platform6Data.roomId = joinRoomRequest.id;

      socket.emit("platformData", platform1Data);
      socket.emit("platformData", platform2Data);
      socket.emit("platformData", platform3Data);
      socket.emit("platformData", platform4Data);
      socket.emit("platformData", platform5Data);
      socket.emit("platformData", platform6Data);
    }

    if (controller.up && rectangle.jumping == false)
    {
      rectangle.y_velocity -= 20;
      rectangle.jumping = true;
    }
    if (controller.left)
    {
      rectangle.x_velocity -= 0.5;
    }
    if (controller.right)
    {
      rectangle.x_velocity += 0.5;
    }

    rectangle.y_velocity += 0.75; // gravity
    rectangle.x += rectangle.x_velocity;
    rectangle.y += rectangle.y_velocity;
    rectangle.x_velocity *= 0.9;// friction
    rectangle.y_velocity *= 0.9;// friction
    //console.log(rectangle.x_velocity);

    if (rectangle.y_velocity > 0) // If rectangle falls off a platform
    {
      rectangle.jumping = true;
    }

    if (isHost)
    {
      platform1.x += platform1.x_velocity;
      platform2.x += platform2.x_velocity;
      platform3.x += platform3.x_velocity;
      platform4.x += platform4.x_velocity;
      platform5.x += platform5.x_velocity;
      platform6.x += platform6.x_velocity;
    }
    else {
      platform1.x = platform1Data.x;
      platform1.y = platform1Data.y;
      platform2.x = platform2Data.x;
      platform2.y = platform2Data.y;
      platform3.x = platform3Data.x;
      platform3.y = platform3Data.y;
      platform4.x = platform4Data.x;
      platform4.y = platform4Data.y;
      platform5.x = platform5Data.x;
      platform5.y = platform5Data.y;
      platform6.x = platform6Data.x;
      platform6.y = platform6Data.y;
    }

    if (Math.abs(rectangle.x_velocity) < 0.1)
    {
      rectangle.x_velocity = 0;
    }
    if (Math.abs(rectangle.y_velocity) < 0.1)
    {
      rectangle.y_velocity = 0;
    }
    // if rectangle is falling below floor line
    if (rectangle.y > context.canvas.height - 16 - rectangle.height)
    {
      rectangle.jumping = false;
      rectangle.y = context.canvas.height - 16 - 32;
      rectangle.y_velocity = 0;
    }
    // player in between platform x limits; above
    if(rectangle.x + rectangle.width > platform1.x && rectangle.x < platform1.x + platform1.width && rectangle.y < platform1.y + platform1.height)
    {

      //we want the player to land on the platform and stay on top
      if (rectangle.y + rectangle.height > platform1.y && rectangle.y_velocity >= 0)
        {
        rectangle.jumping = false;
        rectangle.y = platform1.y - rectangle.height;
        rectangle.y_velocity = 0;
      }
    }
    // player in between platform x limits; above
    if(rectangle.x + rectangle.width > platform2.x && rectangle.x < platform2.x + platform2.width && rectangle.y < platform2.y + platform2.height)
    {

      //we want the player to land on the platform and stay on top
      if (rectangle.y + rectangle.height > platform2.y && rectangle.y_velocity >= 0)
        {
        rectangle.jumping = false;
        rectangle.y = platform2.y - rectangle.height;
        rectangle.y_velocity = 0;
      }
    }
    // player in between platform x limits; above
    if(rectangle.x + rectangle.width > platform3.x && rectangle.x < platform3.x + platform3.width && rectangle.y < platform3.y + platform3.height)
    {

      //we want the player to land on the platform and stay on top
      if (rectangle.y + rectangle.height > platform3.y && rectangle.y_velocity >= 0)
        {
        rectangle.jumping = false;
        rectangle.y = platform3.y - rectangle.height;
        rectangle.y_velocity = 0;
      }

    }

    // player in between platform x limits; above
    if(rectangle.x + rectangle.width > platform4.x && rectangle.x < platform4.x + platform4.width && rectangle.y < platform4.y + platform4.height)
    {

      //we want the player to land on the platform and stay on top
      if (rectangle.y + rectangle.height > platform4.y && rectangle.y_velocity >= 0)
        {
        rectangle.jumping = false;
        rectangle.y = platform4.y - rectangle.height;
        rectangle.y_velocity = 0;
      }
    }

    // player in between platform x limits; above
    if(rectangle.x + rectangle.width > platform5.x && rectangle.x < platform5.x + platform5.width && rectangle.y < platform5.y + platform5.height)
    {

      //we want the player to land on the platform and stay on top
      if (rectangle.y + rectangle.height > platform5.y && rectangle.y_velocity >= 0)
        {
        rectangle.jumping = false;
        rectangle.y = platform5.y - rectangle.height;
        rectangle.y_velocity = 0;
      }
    }

    // player in between platform x limits; above
    if(rectangle.x + rectangle.width > platform6.x && rectangle.x < platform6.x + platform6.width && rectangle.y < platform6.y + platform6.height)
    {

      //we want the player to land on the platform and stay on top
      if (rectangle.y + rectangle.height > platform6.y && rectangle.y_velocity >= 0)
        {
        rectangle.jumping = false;
        rectangle.y = platform6.y - rectangle.height;
        rectangle.y_velocity = 0;
      }
    }


    // If game not started, player can go off left edge
    // and come out the right edge.
    if (!gameStarted)
    {
      // if rectangle is going off the left of the screen
      if (rectangle.x < -32) {
          rectangle.x = context.canvas.width;
      }
      else if (rectangle.x > context.canvas.width) { // if rectangle goes past right boundary
        rectangle.x = -32;
      }


      // platforms should translate across screen repeatedly
      if (platform1.x > context.canvas.width) {
        platform1.x = -(platform1.width);
      }

      if (platform2.x + platform2.width < 0) {
        platform2.x = context.canvas.width;
      }

      if (platform3.x > context.canvas.width) {
        platform3.x = -platform3.width;
      }

      if (platform4.x + platform4.width < 0) {
        platform4.x = context.canvas.width;
      }

      if (platform5.x > context.canvas.width) {
        platform5.x = -platform5.width;
      }

      if (platform6.x + platform6.width < 0) {
        platform6.x = context.canvas.width;
      }

      // ability to jump on other player 2
      if(rectangle.x + rectangle.width > playerData_2.x && rectangle.x < playerData_2.x + 32 && rectangle.y + 32 < playerData_2.y){

        if(rectangle.y + rectangle.height + 7 > playerData_2.y && rectangle.y_velocity >= 0){
          rectangle.y_velocity -= 30;
          rectangle.y = playerData_2.y - rectangle.height;
          rectangle.jumping = true;
        }
      }

      //right side collision detection, player 2
      if(rectangle.x >= playerData_2.x + 32 && rectangle.y + rectangle.height >= playerData_2.y + 32 && rectangle.y <= playerData_2.y){

        if((playerData_2.x + 32 - rectangle.x) > -5 && (playerData_2.x + 32 - rectangle.x) < 0 && rectangle.x_velocity < 0){
          rectangle.x += 80;
        }

      }

      //left side collision detection, player 2
      if(rectangle.x + rectangle.width <= playerData_2.x && rectangle.y + rectangle.height >= playerData_2.y + 32 && rectangle.y <= playerData_2.y){

        if(playerData_2.x - (rectangle.x + rectangle.width) < 5 && playerData_2.x - (rectangle.x + rectangle.width) > 0 && rectangle.x_velocity > 0){
          rectangle.x -= 80;
        }
      }

      // ability to jump on other player 3
      if(rectangle.x + rectangle.width > playerData_3.x && rectangle.x < playerData_3.x + 32 && rectangle.y + 32 < playerData_3.y){

        if(rectangle.y + rectangle.height + 7 > playerData_3.y && rectangle.y_velocity >= 0){
          rectangle.y_velocity -= 30;
          rectangle.y = playerData_3.y - rectangle.height;
          rectangle.jumping = true;
        }
      }

      //right side collision detection, player 3
      if(rectangle.x >= playerData_3.x + 32 && rectangle.y + rectangle.height >= playerData_3.y + 32 && rectangle.y <= playerData_3.y){

        if((playerData_3.x + 32 - rectangle.x) > -5 && (playerData_3.x + 32 - rectangle.x) < 0 && rectangle.x_velocity < 0){
          rectangle.x += 80;
        }

      }

      //left side collision detection, player 3
      if(rectangle.x + rectangle.width <= playerData_3.x && rectangle.y + rectangle.height >= playerData_3.y + 32 && rectangle.y <= playerData_3.y){

        if(playerData_3.x - (rectangle.x + rectangle.width) < 5 && playerData_3.x - (rectangle.x + rectangle.width) > 0 && rectangle.x_velocity > 0){
          rectangle.x -= 80;
        }
      }

      // ability to jump on other player 4
      if(rectangle.x + rectangle.width > playerData_4.x && rectangle.x < playerData_4.x + 32 && rectangle.y + 32 < playerData_4.y){

        if(rectangle.y + rectangle.height + 7 > playerData_4.y && rectangle.y_velocity >= 0){
          rectangle.y_velocity -= 30;
          rectangle.y = playerData_4.y - rectangle.height;
          rectangle.jumping = true;
        }
      }

      //right side collision detection, player 4
      if(rectangle.x >= playerData_4.x + 32 && rectangle.y + rectangle.height >= playerData_4.y + 32 && rectangle.y <= playerData_4.y){

        if((playerData_4.x + 32 - rectangle.x) > -5 && (playerData_4.x + 32 - rectangle.x) < 0 && rectangle.x_velocity < 0){
          rectangle.x += 80;
        }

      }

      //left side collision detection, player 4
      if(rectangle.x + rectangle.width <= playerData_4.x && rectangle.y + rectangle.height >= playerData_4.y + 32 && rectangle.y <= playerData_4.y){

        if(playerData_4.x - (rectangle.x + rectangle.width) < 5 && playerData_4.x - (rectangle.x + rectangle.width) > 0 && rectangle.x_velocity > 0){
          rectangle.x -= 80;
        }
      }

    }
    // If game started, this is not allowed
    else if (gameStarted)
    {
      // if rectangle is going off the left of the screen
      if (rectangle.x < -32) {
          rectangle.x = context.canvas.width;
      }
      else if (rectangle.x > context.canvas.width) { // if rectangle goes past right boundary
        rectangle.x = -32;
      }
    }
    // platforms should keeping looping... if one goes off the left end, it should come back around the right end
    if (platform1.x > context.canvas.width) {
      platform1.x = -(platform1.width);
    }

      // platforms should translate across screen repeatedly
      if (platform1.x > context.canvas.width) {
        platform1.x = -(platform1.width);
      }

      if (platform2.x + platform2.width < 0) {
        platform2.x = context.canvas.width;
      }

      if (platform3.x > context.canvas.width) {
        platform3.x = -platform3.width;
      }

      if (platform4.x + platform4.width < 0) {
        platform4.x = context.canvas.width;
      }

      if (platform5.x > context.canvas.width) {
        platform5.x = -platform5.width;
      }

      if (platform6.x + platform6.width < 0) {
        platform6.x = context.canvas.width;
      }

      // ability to jump on other player 2
      if(rectangle.x + rectangle.width > playerData_2.x && rectangle.x < playerData_2.x + 32 && rectangle.y + 32 < playerData_2.y){

        if(rectangle.y + rectangle.height + 7 > playerData_2.y && rectangle.y_velocity >= 0){
          rectangle.y_velocity -= 30;
          rectangle.y = playerData_2.y - rectangle.height;
          rectangle.jumping = true;
        }
      }

      //right side collision detection, player 2
      if(rectangle.x >= playerData_2.x + 32 && rectangle.y + rectangle.height >= playerData_2.y + 32 && rectangle.y <= playerData_2.y){

        if((playerData_2.x + 32 - rectangle.x) > -5 && (playerData_2.x + 32 - rectangle.x) < 0 && rectangle.x_velocity < 0){
          rectangle.x += 80;
        }

      }

      //left side collision detection, player 2
      if(rectangle.x + rectangle.width <= playerData_2.x && rectangle.y + rectangle.height >= playerData_2.y + 32 && rectangle.y <= playerData_2.y){

        if(playerData_2.x - (rectangle.x + rectangle.width) < 5 && playerData_2.x - (rectangle.x + rectangle.width) > 0 && rectangle.x_velocity > 0){
          rectangle.x -= 80;
        }
      }

      // ability to jump on other player 3
      if(rectangle.x + rectangle.width > playerData_3.x && rectangle.x < playerData_3.x + 32 && rectangle.y + 32 < playerData_3.y){

        if(rectangle.y + rectangle.height + 7 > playerData_3.y && rectangle.y_velocity >= 0){
          rectangle.y_velocity -= 30;
          rectangle.y = playerData_3.y - rectangle.height;
          rectangle.jumping = true;
        }
      }

      //right side collision detection, player 3
      if(rectangle.x >= playerData_3.x + 32 && rectangle.y + rectangle.height >= playerData_3.y + 32 && rectangle.y <= playerData_3.y){

        if((playerData_3.x + 32 - rectangle.x) > -5 && (playerData_3.x + 32 - rectangle.x) < 0 && rectangle.x_velocity < 0){
          rectangle.x += 80;
        }

      }

      //left side collision detection, player 3
      if(rectangle.x + rectangle.width <= playerData_3.x && rectangle.y + rectangle.height >= playerData_3.y + 32 && rectangle.y <= playerData_3.y){

        if(playerData_3.x - (rectangle.x + rectangle.width) < 5 && playerData_3.x - (rectangle.x + rectangle.width) > 0 && rectangle.x_velocity > 0){
          rectangle.x -= 80;
        }
      }

      // ability to jump on other player 4
      if(rectangle.x + rectangle.width > playerData_4.x && rectangle.x < playerData_4.x + 32 && rectangle.y + 32 < playerData_4.y){

        if(rectangle.y + rectangle.height + 7 > playerData_4.y && rectangle.y_velocity >= 0){
          rectangle.y_velocity -= 30;
          rectangle.y = playerData_4.y - rectangle.height;
          rectangle.jumping = true;
        }
      }

      //right side collision detection, player 4
      if(rectangle.x >= playerData_4.x + 32 && rectangle.y + rectangle.height >= playerData_4.y + 32 && rectangle.y <= playerData_4.y){

        if((playerData_4.x + 32 - rectangle.x) > -5 && (playerData_4.x + 32 - rectangle.x) < 0 && rectangle.x_velocity < 0){
          rectangle.x += 80;
        }

      }

      //left side collision detection, player 4
      if(rectangle.x + rectangle.width <= playerData_4.x && rectangle.y + rectangle.height >= playerData_4.y + 32 && rectangle.y <= playerData_4.y){

        if(playerData_4.x - (rectangle.x + rectangle.width) < 5 && playerData_4.x - (rectangle.x + rectangle.width) > 0 && rectangle.x_velocity > 0){
          rectangle.x -= 80;
        }
      }



    if (platform3.y < 0) {
      platform3.y = context.canvas.height;
    }

    /* Drawing the level */
    context.fillStyle = "#202020";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);// x, y, width, height
    context.strokeStyle = "#202830";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, context.canvas.height - 16);
    context.lineTo(context.canvas.width, context.canvas.height - 16);
    context.stroke();

    context.font = "10px Arial";
    context.fillStyle = "#FFFFFF";
    context.textAlign = "left";
    context.fillText(gameIdString, 5, 15);

    // for flashing text... only setInterval if not yet set
    if (!intSet && (playerCount < maxPlayers))
    {
      intervalId = setInterval(() => {
        if (textPosInt === 25) {
          textPosInt = 25000;
        }
        else if (textPosInt === 35) {
          textPosInt = 35000;
        }
        else if (textPosInt === 25000) {
          textPosInt = 25;
        }
        else if (textPosInt === 35000) {
          textPosInt = 35;
        }
      }, 500);
      intSet = true;
    }
    // Hide playButton if no other players in game...
    if (playerCount === 1 && isHost)
    {
      playButton.style.opacity = 0;
      playButton.disabled = true;
    }
    // Once there is more than one player, show and enable playButton ONLY FOR HOST
    // until game is started
    if (playerCount > 1 && isHost && !beginGame && !gameStarted)
    {
      playButton.style.opacity = 1;
      playButton.disabled = false;
      playButton.innerHTML = "Start Game with " + playerCount + " Players";
    }
    // Incrementing playerCount as players come in
    if (playerData_2.id && !player2_added)
    {
      playerCount++;
      player2_added = true;
      connEventString = playerData_2.name + " has joined!";
    }
    if (playerData_3.id && !player3_added)
    {
      playerCount++;
      player3_added = true;
      connEventString = playerData_3.name + " has joined!";
    }
    if (playerData_4.id && !player4_added)
    {
      playerCount++;
      player4_added = true;
      connEventString = playerData_4.name + " has joined!";
    }
    if (connData.player2_connected)
    {
      player2_added = true;
    }
    /* checking if players have disconnected from the game */
    if (player2_added && !connData.player2_connected)
    {
      console.log(player2_added);
      console.log("reached!");
      console.log(connData.player2_connected);
      player2_added = false;
      playerCount--;
      connEventString = playerData_2.name + " disconnected";
    }
    if (!(connData.player3_connected) && player3_added)
    {
      player3_added = false;
      playerCount--;
      connEventString = playerData_3.name + " disconnected";
    }
    if (!(connData.player4_connected) && player4_added)
    {
      player4_added = false;
      playerCount--;
      connEventString = playerData_4.name + " disconnected";
    }
    const playerCountString = "(" + playerCount.toString() + "/" + maxPlayers + ")";
    // Only show the waiting for players text if the game hasn't been started yet
    if (!beginGame && !gameStarted)
    {
      let playerJoinString = "";
      // show different text, depending on if the game if full or not:
      if (playerCount < maxPlayers)
      {
        playerJoinString = "Waiting for players... ";
      }
      else
      {
        playerJoinString = "Game is full! Waiting for host to start... "
      }
      // display last connection event (joining/disconnecting players)
      context.fillText(connEventString, 5, 25);
      if (connEventString && (textPosInt != 35) && (textPosInt != 35000))
      {
        textPosInt = 35;
      }
      // display current waiting room state and no of players
      context.fillText(playerJoinString + playerCountString, 5, textPosInt);

    }
    if (startButtonPressed && !stopWaiting)
    {
      playButton.style.opacity = 0;
      playButton.disabled = true;
      beginGame = true;
      stopWaiting = true;
      if (stopWaiting)
      {
        clearInterval(intervalId);
        intSet = false;
        textPosInt = 25;
      }
    }
    if (beginGame && !gameStarted)
    {
      if (!intSet)
      {
        // Start the countdown
        intervalId = setInterval(() => {
          timeToStart--;
        }, 1000);
        intSet = true;
        // delete last connection event
        connEventString = "";
      }
      console.log(intSet)
      console.log(timeToStart);
      context.fillText("Game Starting In... " + timeToStart, 5, 25);
    }
    if (timeToStart === 0)
    {
      gameStarted = true;
      clearInterval(intervalId);
    }
    // Code to only run once when the game starts
    if (gameStarted && beginGame)
    {
      beginGame = false;
      // set all players' positions to left end of screen
      rectangle.x = 5;
      rectangle.x_velocity = 0;
      rectangle.y = context.canvas.height - 16 - 32;
      rectangle.y_velocity = 0;
    }
    // Code that constantly runs once the game has started, before it ends
    if (gameStarted && !endReached)
    {
      context.fillText("Go! Reach the end first to win!", 5, 25);
      // Write 'END' below endzone
      context.fillText("END", context.canvas.width/2 + 2, 25);
      // Draw endzone
      drawRect("#228B22", context.canvas.width / 2, 16 + rectangle.height);
      context.fillStyle = "white";
      // if player reaches end
      if (rectangle.x > context.canvas.width / 2 - 32 &&
          rectangle.x < context.canvas.width / 2 + 32 &&
          rectangle.y < 64)
      {
        endReached = true;
        youWin = true;
      }
    }
    if (endReached && youWin)
    {
      context.fillText("You Win!", 5, 25);
      sendWinMsg = true;
      menuButton.style.opacity = 1; // make return to menu button visible
      menuButton.disabled = false; // enable its functionality
    }
    if (endReached && youLose)
    {
      context.fillText("Player with socket id: " +
      localWinnerInfo.socketId + " won!", 5, 25);
      menuButton.style.opacity = 1; // make return to menu button visible
      menuButton.disabled = false; // enable its functionality
    }
    if (sendWinMsg)
    {
      sendWinMsg = false; // Done so winMsg only gets sent once
      localWinnerInfo.socketId = socket.id;
      localWinnerInfo.roomId = joinRoomRequest.id;
      socket.emit("winMsg", localWinnerInfo);
    }
    // Handling winMsg, if received
    socket.on("winMsg", (winnerInfo) => {
      localWinnerInfo = { ...winnerInfo };
      endReached = true;
      youLose = true;
    });

    /* Sending my data (position, playerName, roomId) to the server */
    myData.x = rectangle.x;
    myData.y = rectangle.y;
    myData.jumping = rectangle.jumping;
    myData.name = playerName;
    myData.roomId = joinRoomRequest.id;
    socket.emit("playerData", myData);



    /* Changing text font/formatting for drawing playernames */
    context.textAlign = "center";
    let playerConnections = {
      roomId: joinRoomRequest.id,
      player2_sockId: playerData_2.id,
      player3_sockId: playerData_3.id,
      player4_sockId: playerData_4.id
    };
    socket.emit("checkConnections", playerConnections);
    /* Drawing other players' rectangles and playerNames */

    if (player2_added && connData.player2_connected)
    {
      drawRect("#FF0000", playerData_2.x, playerData_2.y);
      context.fillText(playerData_2.name, playerData_2.x + 15, playerData_2.y - 8);
    }
    if (player3_added && connData.player3_connected)
    {
      drawRect("#FF0000", playerData_3.x, playerData_3.y);
      context.fillText(playerData_3.name, playerData_3.x + 15, playerData_3.y - 8);
    }
    if (player4_added && connData.player4_connected)
    {
      drawRect("#FF0000", playerData_4.x, playerData_4.y);
      context.fillText(playerData_4.name, playerData_4.x + 15, playerData_4.y - 8);
    }
    /* Drawing my rectangle on the screen last so it's on top */
    drawRect("#00FFFF", rectangle.x, rectangle.y);
    /* Drawing my playerName over my rectangle */
    context.fillText(playerName, rectangle.x + 15, rectangle.y - 8);

    /* Drawing 1st platform */
    drawPlatform("#FFFFFF", platform1.x, platform1.y);
    /* Drawing 2nd platform */
    drawPlatform("#FFFFFF", platform2.x, platform2.y);
    /* Drawing 3rd platform */
    drawPlatform("#FFFFFF", platform3.x, platform3.y);

    drawPlatform("#FFFFFF", platform4.x, platform4.y);

    drawPlatform("#FFFFFF", platform5.x, platform5.y);

    drawPlatform("#FFFFFF", platform6.x, platform6.y);

    // call update when the browser is ready to draw again
    window.requestAnimationFrame(loop);
  };

  window.addEventListener("keydown", controller.keyListener)
  window.addEventListener("keyup", controller.keyListener);
  window.requestAnimationFrame(loop);

  const drawRect = (color, xPos, yPos) => {
    context.fillStyle = color; // hex for light blue
    context.beginPath();
    context.rect(xPos, yPos, rectangle.width, rectangle.height); // width & height are both 32
    context.fill();
  };
  const drawPlatform = (color, xPos, yPos) => {
    context.fillStyle = color; // hex for white
    context.beginPath();
    context.rect(xPos, yPos, platform1.width, platform1.height);
    context.fill();
  };

  /* received socket message handlers */
  /* 1. receiving other players' positions from the server */
  socket.on("playerData", (playerData) => {
    if (playerData_2.id === null ||
        !connData.player2_connected ||
        playerData_2.id === playerData.id)
    {
      playerData_2.id = playerData.id;
      playerData_2.x = playerData.x;
      playerData_2.y = playerData.y;
      playerData_2.jumping = playerData.jumping;
      playerData_2.name = playerData.name;
    }
    else if (playerData_3.id === null ||
             !connData.player3_connected ||
             playerData_3.id === playerData.id)
    {
      playerData_3.id = playerData.id;
      playerData_3.x = playerData.x;
      playerData_3.y = playerData.y;
      playerData_3.jumping = playerData.jumping;
      playerData_3.name = playerData.name;
    }
    else if (playerData_4.id === null ||
             !connData.player4_connected ||
             playerData_4.id === playerData.id)
    {
      playerData_4.id = playerData.id;
      playerData_4.x = playerData.x;
      playerData_4.y = playerData.y;
      playerData_4.jumping = playerData.jumping;
      playerData_4.name = playerData.name;
    }
  });
  /* 2. receiving platform's positions from the server */
  socket.on("platformData", recdPlatformData => {
    if (recdPlatformData.platformNo === 1)
    {
      platform1Data.x = recdPlatformData.x;
      platform1Data.y = recdPlatformData.y;
    }
    else if (recdPlatformData.platformNo === 2)
    {
      platform2Data.x = recdPlatformData.x;
      platform2Data.y = recdPlatformData.y;
    }
    else if (recdPlatformData.platformNo === 3)
    {
      platform3Data.x = recdPlatformData.x;
      platform3Data.y = recdPlatformData.y;
    }
    else if (recdPlatformData.platformNo === 4)
    {
      platform4Data.x = recdPlatformData.x;
      platform4Data.y = recdPlatformData.y;
    }
    else if (recdPlatformData.platformNo === 5)
    {
      platform5Data.x = recdPlatformData.x;
      platform5Data.y = recdPlatformData.y;
    }
    else if (recdPlatformData.platformNo === 6)
    {
      platform6Data.x = recdPlatformData.x;
      platform6Data.y = recdPlatformData.y;
    }
  });
  /* 3. receiving whether players are still connected to the game */
  socket.on("currentConnections", currentConnections => {
    connData = { ...currentConnections };
  });
});
