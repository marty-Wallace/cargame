/**
 * Created by Marty on 2/3/2017.
 *
 * The Game state is the main game loop. All game related logic will reside in this state. Upon completion of the game the Game state will
 * start the Achievements state to display to the user the prize they one.
 */

Game.Game = function(game) { };


var map;                                // our tile-map
var tile_layer;                         // the tile layer, which we don't actually interact with. It's just there to be pretty
var poly_tiles;                         // the terrain which we collide with

var vehicle;                            // the vehicle!
var startX = 46, startY = 4*32;         // starting position (we can move this into the maps later if we need)
var cursors;                            // all of our possible cursor actions
var score = 0;                          // the current score of the player
var furthestX = startX;                 // the further the player gets the more we will add to their score (maybe)

var music;                              // the audio we will be blastin

var VELOCITY_PER_TICK = 160;            // the amount of velocity to add per update when a key is pressed
var VELOCITY_MULTIPLIER = 0.85;         // the multiplier we apply each update to the current velocity

var ANGULAR_VELOCITY_PER_TICK = 1;      // the amount of angular velocity to add per update when a key is pressed
var ANGULAR_VELOCITY_MULTIPLIER = 0.9;  // the multiplier we apply each update to the current angular velocity
var MAX_ANGULAR_VELOCITY = 4;           // the maximum angular velocity we will allow the vehicle to have

var FLIPPED_ANGLE = 91;                // the maximum angle in degrees where we consider the vehicle to not be flipped

var WORLD_RESTITUTION = 0.25;           // how bouncy is the world we live in
var WORLD_GRAVITY = 1800;               // how much gravity in the world

var LEVEL = 2;                          // the current level we are testing
var level32s = [2];                     // the list of levels which use a 32x32px tile-set, (so we know which one to load)

Game.Game.prototype = {

    create: function(game){


        game.stage.smoothed = true;

        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.gravity.y = WORLD_GRAVITY;
        game.physics.p2.restitution = WORLD_RESTITUTION;

        music = game.add.audio('level_music');
        music.play('', 0, .5, true);


        /*
        // csv style loading
        map = this.add.tilemap('map', 64, 64);
        map.addTilesetImage('tileset');
        layer = map.createLayer(0);
        layer.resizeWorld();

        map.setCollisionBetween(1, 33);
         game.physics.p2.convertTilemap(map, layer);
        */


        map = game.add.tilemap('map' + LEVEL);
        //JSON style loading
        if( level32s.indexOf(LEVEL) > -1){
            map.addTilesetImage('32x32tileset', '32x32tileset');
        }else{
            map.addTilesetImage('tileset', 'tileset');
        }

        tile_layer = map.createLayer('tiles');
        tile_layer.resizeWorld();

        game.physics.p2.convertTilemap(map, tile_layer);

        poly_tiles = game.physics.p2.convertCollisionObjects(map, 'terrain', true);


        vehicle = game.add.sprite(startX, startY, 'car', 0);
        game.physics.p2.enable(vehicle);
        vehicle.anchor.setTo(0.5, 0.5);
        vehicle.body.loadPolygon('car_physics', 'car_halfsize');
        game.camera.follow(vehicle);


        cursors = game.input.keyboard.createCursorKeys();



    },

    update: function(game) {


        var touchingDown = this.touchingDown(vehicle);

        if(touchingDown){
            vehicle.body.velocity.x *= VELOCITY_MULTIPLIER;
            vehicle.body.angularVelocity *= ANGULAR_VELOCITY_MULTIPLIER;
        }

        if(this.isFlipped(vehicle, touchingDown)) {
            this.resetPlayer();
        }

        /*
            Right key applies anti-clockwise angular velocity
            Left key applies clockwise angular velocity
            Up key applies forward momentum (always to the right for now)
            Down key applies backwards momentum (always to the left for now)
         */

        if (cursors.right.isDown && touchingDown){
            vehicle.body.angularVelocity += ANGULAR_VELOCITY_PER_TICK;
            /*
            if(vehicle.body.angularVelocity > MAX_ANGULAR_VELOCITY){
                vehicle.body.angularVelocity = MAX_ANGULAR_VELOCITY;
            }
            */

        }

        else if (cursors.left.isDown && touchingDown){
            vehicle.body.angularVelocity -= ANGULAR_VELOCITY_PER_TICK;
            /*
            if(vehicle.body.angularVelocity < -MAX_ANGULAR_VELOCITY){
                vehicle.body.angularVelocity = -MAX_ANGULAR_VELOCITY;
            }
            */
        }

        if(cursors.down.isDown && touchingDown){
            vehicle.body.velocity.x -= VELOCITY_PER_TICK;
        }

        else if (cursors.up.isDown && touchingDown){
            vehicle.body.velocity.x += VELOCITY_PER_TICK;
        }

        //every time they go further we will increase their score
        if(vehicle.body.x > furthestX){
            score += (vehicle.body.x - furthestX);
            furthestX = vehicle.body.x;
            console.log('Score: ' + score);
        }

   },


    resetPlayer: function() {
        vehicle.body.velocity.x = 0;
        vehicle.body.velocity.y = 0;
        vehicle.body.angularVelocity = 0;
        vehicle.body.angle = 0;
        vehicle.reset(startX, startY);
        score = 0;
        furthestX = startX;
    },

    isFlipped: function(sprite, touchingDown) {
        var angle = sprite.body.angle;
        return touchingDown && (angle > FLIPPED_ANGLE || angle < -FLIPPED_ANGLE);
    },

    /*
     this function uses the p2 collision calculations that are done on every step to find out
     if the player collides with something on the bottom - it returns true if a collision is happening
     */
    touchingDown: function(sprite) {
        var yAxis = p2.vec2.fromValues(0, 1);
        var result = false;
        for (var i = 0; i < this.physics.p2.world.narrowphase.contactEquations.length; i++) {
            var c = this.physics.p2.world.narrowphase.contactEquations[i];  // cycles through all the contactEquations until it finds our "sprite"
            if (c.bodyA === sprite.body.data || c.bodyB === sprite.body.data)        {
                var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
                if (c.bodyA === sprite.body.data) d *= -1;
                if (d > 0.5) result = true;
            }
        } return result;
    }

};
