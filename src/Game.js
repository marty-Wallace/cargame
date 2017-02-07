/**
 * Created by Marty on 2/3/2017.
 *
 * The Game state is the main game loop. All game related logic will reside in this state. Upon completion of the game the Game state will
 * start the Achievements state to display to the user the prize they one.
 */

Game.Game = function(game) { };


var map;
var tile_layer;
var poly_tiles;

var vehicle;
var startX = 46, startY = 4*32;
var cursors;
var dist = 0;

var music;

var VELOCITY_PER_TICK = 150;
var VELOCITY_MUTIPLIER = 0.85;


var ANGULAR_VELOCITY_PER_TICK = 1;
var ANGULAR_VELOCITY_MUTIPLIER = 0.9;

Game.Game.prototype = {

    create: function(game){


        game.stage.smoothed = true;

        game.physics.startSystem(Phaser.Physics.P2JS);

        music = game.add.audio('level_music');
        music.play('', 0, .5, true);
        /*
        //csv style loading
        map = this.add.tilemap('map', 64, 64);
        map.addTilesetImage('tileset');
        layer = map.createLayer(0);
        layer.resizeWorld();

        map.setCollisionBetween(1, 33);
         game.physics.p2.convertTilemap(map, layer);
        */

        game.physics.p2.gravity.y = 1800;
        game.physics.p2.restitution = 0.15;

        //JSON style loading
        map = game.add.tilemap('map');
        map.addTilesetImage('tileset', 'tileset');

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

        console.log(vehicle.body.angle);

        vehicle.body.velocity.x *= .85;
        vehicle.body.angularVelocity *= ANGULAR_VELOCITY_MUTIPLIER;

        if (cursors.left.isDown){
            vehicle.body.velocity.x -= 150;
            vehicle.body.angularVelocity += ANGULAR_VELOCITY_PER_TICK;
            /*
            if(vehicle.body.angularVelocity > MAX_ANGULAR_VELOCITY){
                vehicle.body.angularVelocity = MAX_ANGULAR_VELOCITY;
            }
            */

        }

        else if (cursors.right.isDown){
            vehicle.body.velocity.x += 150;
            vehicle.body.angularVelocity -= ANGULAR_VELOCITY_PER_TICK;
            /*
            if(vehicle.body.angularVelocity < - MAX_ANGULAR_VELOCITY){
                vehicle.body.angularVelocity = - MAX_ANGULAR_VELOCITY;
            }
            */
        }

        else if (cursors.up.isDown){
            //for testing purposes, cause I keep getting stuck.
            vehicle.body.velocity.y -= 400;
        }

   },


    resetPlayer: function(game) {
        vehicle.reset(startX, startY);
        dist = 0;
    }


};