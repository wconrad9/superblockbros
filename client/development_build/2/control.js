// Frank Poth 08/13/2017
// Add event listener for if page is loaded
window.addEventListener("load", function(event) {
  var context, menuButton, controller, rectangle, loop;

  context = document.querySelector("canvas").getContext("2d");
  menuButton = document.getElementById("menuButton");
  //menuButton.style.opacity = "0";

  context.canvas.height = 180;
  context.canvas.width = 320;

  // context.canvas.style.width = "1280px";
  // context.canvas.style.height = "720px";

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
  const params = new URLSearchParams(window.location.search);
  const joinRoomRequest = {
    id: params.get("id").toString()
  }
  socket.emit("joinRoom", joinRoomRequest);
  // To display Game ID in-game
  const gameIdString = "Game ID: " + joinRoomRequest.id;

  // Object to hold my positional data to send to server
  const myPositionData = {};
  /* Objects to hold other players' positional data received
    from server */ 
  const playerPositionData_2 = {};
  const playerPositionData_3 = {};
  const playerPositionData_4 = {};
  playerPositionData_2.id = null;
  playerPositionData_3.id = null;
  playerPositionData_4.id = null;

  // Variables for flashing text
  let intSet = false;
  let textPosInt = 25;
  var intervalId = 0;

  // Variables to hold & keep track of current playerCount as well as gameState:
  let playerCount = 1;
  let playerJoinString = "Waiting for players... "
  let player2_added = false;
  let player3_added = false;
  let player4_added = false;
  let maxPlayers = 2;

  let localWinnerInfo = {};

  let beginGame = false;
  let timeToStart = 5;
  let gameStarted = false;
  let endReached = false;
  let youWin = false;
  let youLose = false;
  let sendWinMsg = false; 

  loop = function() {

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
    rectangle.y_velocity += 0.75;// gravity
    rectangle.x += rectangle.x_velocity;
    rectangle.y += rectangle.y_velocity;
    rectangle.x_velocity *= 0.9;// friction
    rectangle.y_velocity *= 0.9;// friction
    //console.log(rectangle.x_velocity);

    if (Math.abs(rectangle.x_velocity) < 0.1)
    {
      rectangle.x_velocity = 0;
    }
    if (Math.abs(rectangle.y_velocity) < 0.1)
    {
      rectangle.y_velocity = 0;
    }
    // if rectangle is falling below floor line
    if (rectangle.y > 180 - 16 - 32) 
    {
      rectangle.jumping = false;
      rectangle.y = 180 - 16 - 32;
      rectangle.y_velocity = 0;
    }
    
    // If game not started, player can go off left edge
    // and come out the right edge.
    if (!gameStarted)
    {    
      // if rectangle is going off the left of the screen
      if (rectangle.x < -32) { 
          rectangle.x = 320;
      } 
      else if (rectangle.x > 320) { // if rectangle goes past right boundary
        rectangle.x = -32;
      }
    }
    // If game started, this is not allowed
    else if (gameStarted)
    {
      if (rectangle.x < 0)
      {
        rectangle.x = 0;
        rectangle.x_velocity = 0;
      }
      else if (rectangle.x > (320 - 32)) 
      { 
        rectangle.x = 320 - 32;
      }
    }
    /* Drawing the level */
    context.fillStyle = "#202020";
    context.fillRect(0, 0, 320, 180);// x, y, width, height
    context.strokeStyle = "#202830";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, 164);
    context.lineTo(320, 164);
    context.stroke();

    context.font = "10px Arial";
    context.fillStyle = "#FFFFFF";
    context.fillText(gameIdString, 5, 15);

    // For flashing text... only setInterval if not yet set
    if (!intSet && (playerCount < maxPlayers))
    {
      intervalId = setInterval(() => { 
        if (textPosInt === 25)
        {
          textPosInt = 10000;
          //console.log(textPosInt);
        }
        else {
          textPosInt = 25;
        }
      }, 500);
      intSet = true;
    }
    // If there are more than one player:
    if (playerPositionData_2.id && !player2_added)
    {
      clearInterval(intervalId);
      intSet = false;
      textPosInt = 25;
      playerJoinString = "Players have joined!";
      playerCount++;
      player2_added = true;
    }
    context.fillText(playerJoinString, 5, textPosInt); 
    const playerCountString = "(" + playerCount.toString() + "/" + maxPlayers + ")"; 
    context.fillText(playerCountString, 100, textPosInt);

    if (playerCount === maxPlayers && !gameStarted)
    {
      beginGame = true;
      if (!intSet)
      {
        intervalId = setInterval(() => {
          timeToStart--;
        }, 1000);
        intSet = true;
      }
      context.fillText("Game Starting In... " + timeToStart, 5, 35);
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
      rectangle.y = 180 - 16 - 32;
      rectangle.y_velocity = 0;
    }
    // Code that constantly runs once the game has started
    if (gameStarted && !endReached)
    {
      context.fillText("Go! Reach the end first to win!", 5, 35);
      // Write 'END' below endzone
      context.fillText("END", 320 - 27, 180 - 4);
      // Draw endzone
      drawRect("#228B22", 320 - 32, 180 - 16 - 32);
      context.fillStyle = "white";
      // if player reaches end
      if (rectangle.x === 320 - 32 &&
          rectangle.y === 180 - 16 - 32)
      {
        endReached = true;
        youWin = true;
      }
    }
    if (endReached && youWin)
    {
      context.fillText("Finish!", 5, 35);
      context.fillText("You Win!", 5, 45);
      sendWinMsg = true;
      menuButton.style.opacity = 1; // make return to menu button visible
    }
    if (endReached && youLose)
    {
      context.fillText("Finish!", 5, 35);
      context.fillText("Player with socket id: " +
      localWinnerInfo.socketId + " won!", 5, 45);
      menuButton.style.opacity = 1; // make return to menu button visible
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

    /* Sending my position to the server */
    myPositionData.x = rectangle.x;
    myPositionData.y = rectangle.y;
    myPositionData.jumping = rectangle.jumping;
    myPositionData.roomId = joinRoomRequest.id;
    socket.emit("playerPosition", myPositionData);

    /* Receiving other players' positions from the server */
    socket.on("playerPosition", (playerPositionData) => {
      if (playerPositionData_2.id === null || 
          playerPositionData_2.id === playerPositionData.id)
      {
        playerPositionData_2.id = playerPositionData.id;
        playerPositionData_2.x = playerPositionData.x;
        playerPositionData_2.y = playerPositionData.y;
        playerPositionData_2.jumping = playerPositionData.jumping;
      }
      else if (playerPositionData_3.id === null || 
        playerPositionData_3.id === playerPositionData.id)
      {
        playerPositionData_3.id = playerPositionData.id;
        playerPositionData_3.x = playerPositionData.x;
        playerPositionData_3.y = playerPositionData.y;
        playerPositionData_3.jumping = playerPositionData.jumping;
      }
      else if (playerPositionData_4.id === null || 
        playerPositionData_4.id === playerPositionData.id)
      {
        playerPositionData_4.id = playerPositionData.id;
        playerPositionData_4.x = playerPositionData.x;
        playerPositionData_4.y = playerPositionData.y;
        playerPositionData_4.jumping = playerPositionData.jumping;
      }
    });
    drawRect("#FF0000", playerPositionData_2.x, playerPositionData_2.y);
    drawRect("#FF0000", playerPositionData_3.x, playerPositionData_3.y);
    drawRect("#FF0000", playerPositionData_4.x, playerPositionData_4.y);
    /* Drawing my rectangle on the screen last so it's on top */
    drawRect("#00FFFF", rectangle.x, rectangle.y);

    // call update when the browser is ready to draw again
    window.requestAnimationFrame(loop);
  };
  window.addEventListener("keydown", controller.keyListener)
  window.addEventListener("keyup", controller.keyListener);
  window.requestAnimationFrame(loop);

  const drawRect = (color, xPos, yPos) => {
    context.fillStyle = color; // hex for light blue
    context.beginPath();
    context.rect(xPos, yPos, rectangle.width, rectangle.height);
    context.fill();
  };
});

