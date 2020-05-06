// Frank Poth 03/09/2018

/* The Game class has been updated with a new Player class and given a new world
object that controls the virtual game world. Players, NPCs, world dimensions, collision
maps, and everything to do with the game world are stored in the world object. */

const Game = function() {

  this.world = {

    background_color:"rgba(166,197,241,0.3)",

    friction:0.85,
    gravity:3,

    player:new Game.Player(),
    object:new Game.Object(),
    object2:new Game.Object(),

    height:72,
    width:128,

    collideObject:function(object) {

      if (object.x < 0) { object.x = 0; object.velocity_x = 0; }
      else if (object.x + object.width > this.width) { object.x = this.width - object.width; object.velocity_x = 0; }
      if (object.y < 0) { object.y = 0; object.velocity_y = 0; }
      else if (object.y + object.height > this.height) { object.jumping = false; object.y = this.height - object.height; object.velocity_y = 0; }

    },

    getDistance: function (x1, y1, x2, y2) {

        var dx = x1 - x2;
        var dy = y1 - y2;

        return Math.sqrt((dx * dx) + (dy * dy));

    },

    collideWall:function(object1, object2) {
      //left side collision detection
      if (object1.x <= object2.x + object2.width &&
          object1.x + object1.width >= object2.x &&
          object1.y < object2.y + object2.height &&
          object1.y + object1.height >= object2.y) {
            object1.colliding = true;

            // if moving DOWN, declare that object1 is hitting its BOTTOM edge
            if (object1.velocity_y > 0){
              object1.colliding_top = false;
              object1.colliding_bottom = true;
              object1.colliding_left = false;
              object1.colliding_right = false;
              object1.velocity_y = 0;
              object1.y = object2.y - object2.height;
              object1.jumping = false;
            }
              // if moving to the RIGHT, declare that object1 is hitting its right edge
            if (object1.velocity_x > 0 && object1.colliding_bottom == false ) {
              object1.colliding_right = true;
              object1.colliding_left = false;
              object1.velocity_x = 0;
              object1.x = object2.x - object1.width;
            }
            // if moving to the LEFT, declare that object1 is hitting its left edge
            else if (object1.velocity_x < 0 && object1.colliding_bottom == false ){
              object1.colliding_right = false;
              object1.colliding_left = true;
              object1.velocity_x = 0;
              object1.x = object2.x + object2.width;
            }

          }
        else{
          object1.colliding = false;
          object1.colliding_left = false;
          object1.colliding_right = false;
          object1.colliding_top = false;
          object1.colliding_bottom = false;

        }


      // if (object1.x < object2.x + object2.width){
      //      object1.velocity_x = 0;
      //      object1.colliding_right = true;
      //      object1.colliding_left = false;
      //    }
      //  if (object1.x + object1.width > object2.x){
      //       object1.velocity_x = 0;
      //       object1.colliding_right = false
      //       object1.colliding_left = true;
      //     }
     // //right side collision detection
     // else if (this.getDistance(
     //   object1.x, object1.y, object2.x, object2.y) <=  0) {
     //      object1.velocity_x = 0;
     //      object1.colliding_right = true;
     //    }
     //  //bottom side collision detection
     //  else if (this.getDistance(
     //    object1.x, object1.y, object2.x, object2.y) < (object1.height/2) + (object2.height/2)) {
     //      object1.velocity_y = 0;
     //      object1.colliding_top = true;
     //     }
     //   //top side collision detection
     //   else if (this.getDistance(
     //     object1.x, object1.y, object2.x, object2.y) < ((object1.height/2) + (object2.height/2)) * -1) {
     //       object1.velocity_y = 0;
     //       object1.colliding_bottom = true;
     //      }


     //  //left side collision detection
     //  else if (this.getDistance(
     //    object1.x, object1.y, object2.x, object2.y) > (object1.width/2) + (object2.width/2)) {
     //       object1.velocity_x = 0;
     //       object1.colliding_left = false;
     //     }
     // //right side collision detection
     // else if (this.getDistance(
     //   object1.x, object1.y, object2.x, object2.y) > ((object1.width/2) + (object2.width/2)) * -1) {
     //      object1.velocity_x = 0;
     //      object1.colliding_right = false;
     //    }
     //  //bottom side collision detection
     //  else if (this.getDistance(
     //    object1.x, object1.y, object2.x, object2.y) > (object1.height/2) + (object2.height/2)) {
     //      object1.velocity_y = 0;
     //      object1.colliding_top = false;
     //     }
     //   //top side collision detection
     //   else if (this.getDistance(
     //     object1.x, object1.y, object2.x, object2.y) > ((object1.height/2) + (object2.height/2)) * -1) {
     //       object1.velocity_y = 0;
     //       object1.colliding_bottom = false;
     //      }

      // if (object.x < 0) { object.x = 0; object.velocity_x = 0; }
      // else if (object.x + object.width > this.width) { object.x = this.width - object.width; object.velocity_x = 0; }
      // if (object.y < 0) { object.y = 0; object.velocity_y = 0; }
      // else if (object.y + object.height > this.height) { object.jumping = false; object.y = this.height - object.height; object.velocity_y = 0; }

    },

    update:function() {

      if (!this.player.colliding_bottom) {this.player.velocity_y += this.gravity;}
      this.player.update();

      this.player.velocity_x *= this.friction;
      this.player.velocity_y *= this.friction;

      this.collideObject(this.player);
      this.collideWall(this.player, this.object);
      // console.log(this.getDistance(this.player.x, this.player.y, this.object.x, this.object.y))
      // console.log("is player colliding: ", this.player.colliding)
      // "player xpos: ", this.player.x,
      console.log(
      "left:", this.player.colliding_left,
      "right:",this.player.colliding_right,
      "top:",this.player.colliding_top,
      "bottom:",this.player.colliding_bottom)



    }

  };

  this.update = function() {

    this.world.update();

  };

};

Game.prototype = { constructor : Game };

Game.Player = function(x, y) {

  this.color      = "#00aa00" // + Math.floor((Math.random() * 16777216) / 2).toString(16);
  this.height     = 16;
  this.jumping    = true;
  this.crouching  = true;
  this.velocity_x = 0;
  this.velocity_y = 0;
  this.old_velocity_x = 0;
  this.old_velocity_y = 0;
  this.width      = 8;
  this.x          = 10;
  this.y          = 50;
  this.colliding = false;
  this.colliding_left  = false;
  this.colliding_right  = false;
  this.colliding_top  = false;
  this.colliding_bottom  = false;
};

Game.Player.prototype = {

  constructor : Game.Player,

  jump:function() {

    if (!this.jumping) {

      // this.color = "#" + Math.floor(Math.random() * 16777216).toString(16);// Change to random color
      /* toString(16) will not add a leading 0 to a hex value, so this: #0fffff, for example,
      isn't valid. toString would cut off the first 0. The code below inserts it. */
      // if (this.color.length != 7) {
      //
      //   this.color = this.color.slice(0, 1) + "0" + this.color.slice(1, 6);
      //
      // }

      this.jumping     = true;
      this.velocity_y -= 20;

    }

  },

  crouch:function() {
      this.crouching = true;
      this.height = 8;
      this.y = this.y + this.height;
      // this.velocity_y -= 20;
  },

  uncrouch:function() {
      this.crouching = true;
      this.height = 16;
  },

  moveLeft:function()  { if (!this.colliding_left) { this.velocity_x -= 0.5; } },
  moveRight:function() { if (!this.colliding_right) { this.velocity_x += 0.5; } },

  update:function() {

    this.x += this.velocity_x;
    this.y += this.velocity_y;
    // this.height = this.height;


  }

};

Game.Object = function(x, y) {

  this.color      = "#330033";
  this.height     = 16;
  this.velocity_x = 0;
  this.velocity_y = 0;
  this.width      = 32;
  this.x          = 50;
  this.y          = 48;

};
