/**
 * Created by Marty on 2/3/2017.
 *
 * The Game state is the main game loop. All game related logic will reside in this state. Upon completion of the game the Game state will
 * start the Achievements state to display to the user the prize they one.
 */

Game.Game = function(game) { };

var LEVEL = 2;                                   // the current level we are testing
var level32s = [2];                              // the list of levels which use a 32x32px tile-set, (so we know which one to load)
var TS = level32s.indexOf(LEVEL) > -1 ? 32 : 64; // assign the tile size

var map;                                         // our tile-map
var tile_layer;                                  // the tile layer, which we don't actually interact with. It's just there to be pretty
var poly_tiles;                                  // the terrain which we collide with

var buttonRight, buttonLeft;
var isPressed = {
    'right': false,
    'left' : false
};

var vehicle;                                     // the vehicle!
var startX = 3 * TS;                             // starting position (we can move this into the maps later if we need)
var startY = 4 * TS;                             // starting position (we can move this into the maps later if we need)
var cursors;                                     // all of our possible cursor actions
var score = 0;                                   // the current score of the player
var furthestX = startX;                          // the further the player gets the more we will add to their score (maybe)
var resetting = false;                           // make sure we don't reset while we're resetting

var music;                                       // the audio we will be blasting!!

var VELOCITY_PER_TICK = 160;                     // the amount of velocity to add per update when a key is pressed
var VELOCITY_MULTIPLIER = 0.85;                  // the multiplier we apply each update to the current velocity

var ANGULAR_VELOCITY_PER_TICK = 1.2;               // the amount of angular velocity to add per update when a key is pressed
var ANGULAR_VELOCITY_MULTIPLIER = 0.9;           // the multiplier we apply each update to the current angular velocity
var MAX_ANGULAR_VELOCITY = 4;                    // the maximum angular velocity we will allow the vehicle to have

var FLIPPED_ANGLE = 91;                          // the maximum angle in degrees where we consider the vehicle to not be flipped

var WORLD_RESTITUTION = 0.25;                    // how bouncy is the world we live in
var WORLD_GRAVITY = 1800;                        // how much gravity in the world


Game.Game.prototype = {

    create: function(game){

        game.stage.smoothed = true;

        // start up p2 physics and set gravity/restitution
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.gravity.y = WORLD_GRAVITY;
        game.physics.p2.restitution = WORLD_RESTITUTION;



        music = game.add.audio('level_music');
        music.play('', 0, .5, true);


        // maps will be named in the form of 'map1', 'map2'... etc
        map = game.add.tilemap('map' + LEVEL);

        // assign either 32x32 or 64x64 tileset based on the level
        if(TS == 32){
            map.addTilesetImage('32x32tileset', '32x32tileset');
        }else{
            map.addTilesetImage('tileset', 'tileset');
        }

        tile_layer = map.createLayer('tiles');
        tile_layer.resizeWorld();
        game.physics.p2.convertTilemap(map, tile_layer);

        // converts the polyline object layer created in tiled named 'terrain' into a collidable object.
        poly_tiles = game.physics.p2.convertCollisionObjects(map, 'terrain', true);


        vehicle = game.add.sprite(startX, startY, 'car', 0);
        game.physics.p2.enable(vehicle);
        vehicle.anchor.setTo(0.5, 0.5);
        vehicle.body.loadPolygon('car_physics', 'car_halfsize');
        game.camera.follow(vehicle);

        buttonLeft = game.add.button(125, (game.world.centerY - 35)*2, 'buttons', function(){
            isPressed['left'] = false;
        }, this, 2, 1, 0);

        buttonLeft.onInputDown.add(function() {
            isPressed['left'] = true;
        }, this);

        buttonRight= game.add.button(335, (game.world.centerY - 35)*2, 'buttons', function(){
            isPressed['right'] = false;
        }, this, 2, 1, 0);

        buttonRight.onInputDown.add(function() {
            isPressed['right'] = true;
        }, this);


        buttonLeft.fixedToCamera = true;
        buttonRight.fixedToCamera = true;
        //okay

        cursors = game.input.keyboard.createCursorKeys();



    },

    update: function(game) {


        // vehicle is resetting. Freeze all vehicle controls
        if(resetting){
            return;
        }

        //touchingDown is an expensive operation, calculate once per update and store it
        var touchingDown = this.touchingDown(vehicle);

        if(touchingDown){
            // if the vehicle is touching any surface then apply multipliers to mimic friction
            vehicle.body.velocity.x *= VELOCITY_MULTIPLIER;
            vehicle.body.angularVelocity *= ANGULAR_VELOCITY_MULTIPLIER;

            // if the vehicle is touching any surface and is 'flipped' then reset the player
            if(isFlipped(vehicle)){
                this.resetVehicle();
            }
        }

        /*
            Player controls
            Right key applies anti-clockwise angular velocity
            Left key applies clockwise angular velocity
            Up key applies forward momentum (always to the right for now)
            Down key applies backwards momentum (always to the left for now)
         */

        // apply angular velocity if left or right is pressed
        if (cursors.right.isDown ){
            vehicle.body.angularVelocity += ANGULAR_VELOCITY_PER_TICK;
            if(vehicle.body.angularVelocity > MAX_ANGULAR_VELOCITY){
                vehicle.body.angularVelocity = MAX_ANGULAR_VELOCITY;
            }
        }
        else if (cursors.left.isDown ){
            vehicle.body.angularVelocity -= ANGULAR_VELOCITY_PER_TICK;
            if(vehicle.body.angularVelocity < -MAX_ANGULAR_VELOCITY){
                vehicle.body.angularVelocity = -MAX_ANGULAR_VELOCITY;
            }
        }

        // apply velocity if up/down arrow pressed
        if(touchingDown && (cursors.down.isDown || isPressed['left'])){
            vehicle.body.velocity.x -= VELOCITY_PER_TICK;
        }
        else if (touchingDown && (cursors.up.isDown || isPressed['right'])){
            vehicle.body.velocity.x += VELOCITY_PER_TICK;
        }

        // increase player score if they have moved forward
        if(vehicle.body.x > furthestX){
            score += (vehicle.body.x - furthestX);
            furthestX = vehicle.body.x;
            console.log('Score: ' + score);
        }

   },


    /*
        Function that creates a delayed reset on the vehicle.
        Immediately sets the vehicles velocity and angular velocity to 0
        then creates a game event that will reset the position of the vehicle
        later. Also sets a game level variable 'resetting' to true, until the vehicle
        is moved back to the beginning.
     */
    resetVehicle: function() {
        resetting = true;
        vehicle.body.velocity.x = 0;
        vehicle.body.velocity.y = 0;
        vehicle.body.angularVelocity = 0;
        score = 0;
        furthestX = startX;

        this.time.events.add(Phaser.Timer.SECOND * 2, function() {
            vehicle.body.angle = 0;
            vehicle.reset(startX, startY);
            resetting = false;
        });
    },


    /*
        Function to check if a sprite it colliding with the ground.
        Uses the p2 collision calculations that are done on every step to find out
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

/*
    Function to check if a sprite is considered 'flipped' based on the angle set out in
    the game constants.
    Returns true if the sprite is flipped. Else false
 */
function isFlipped(sprite) {
    var angle = sprite.body.angle;
    return angle > FLIPPED_ANGLE || angle < -FLIPPED_ANGLE;
}

