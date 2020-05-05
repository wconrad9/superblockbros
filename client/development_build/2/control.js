// Frank Poth 08/13/2017
// Add event listener for if page is loaded
var context, controller, rectangle, loop;

context = document.querySelector("canvas").getContext("2d");

context.canvas.height = 180;
context.canvas.width = 320;

rectangle = 
{
  height:32,
  jumping:true,
  width:32,
  x:144, // center of the canvas
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

  // if rectangle is going off the left of the screen
  if (rectangle.x < -32) {

    rectangle.x = 320;

  } else if (rectangle.x > 320) { // if rectangle goes past right boundary

    rectangle.x = -32;
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

  /* Drawing my rectangle on the screen */
  drawRect("#00FFFF", rectangle.x, rectangle.y);

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