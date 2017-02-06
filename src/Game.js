/**
 * Created by Marty on 2/3/2017.
 *
 * The Game state is the main game loop. All game related logic will reside in this state. Upon completion of the game the Game state will
 * start the Achievements state to display to the user the prize they one.
 */

Game.Game = function(game) { };


var map;
var layer;
var tiles;

var vehicle;
var startX = 46, startY = 4*32;
var cursors;

var velocityX = 0, velocityY = 0;
var speedX = 1.4;
var maxVelocityX = 34;

Game.Game.prototype = {

    create: function(game){


        game.stage.smoothed = true;

        game.physics.startSystem(Phaser.Physics.NINJA);
        game.physics.ninja.setBoundsToWorld();

        //csv style loading
        map = this.add.tilemap('map', 64, 64);
        map.addTilesetImage('tileset');
        layer = map.createLayer(0);
        layer.resizeWorld();

        /*
        //JSON style loading
        map = this.add.tilemap('map');
        map.addTilesetImage('tileset', 'tileset');

        layer = map.createLayer('Tile Layer 1');
        layer.resizeWorld();
        */

        var slopeMap = [];
        slopeMap[0] = -1;
        for(var i = 0; i < 33; i++){
            slopeMap[i] = i;
        }
        tiles = game.physics.ninja.convertTilemap(map, layer, slopeMap);

        vehicle = game.add.sprite(startX, startY, 'car', 0);
        vehicle.scale.setTo(0.5, 0.5);
        vehicle.anchor.setTo(0.5, 0.5);
        game.physics.ninja.enableAABB(vehicle);
        game.camera.follow(vehicle);

        cursors = game.input.keyboard.createCursorKeys();



    },

    update: function(game) {
        for (var i = 0; i < tiles.length; i++){
            vehicle.body.aabb.collideAABBVsTile(tiles[i].tile);
        }

        if(Math.abs(velocityX) > 0 && !cursors.right.isDown && !cursors.left.isDown){
            velocityX /= 2;
        }

        if (cursors.left.isDown){
            if(velocityX >= 0){
                velocityX -= 7;
            }else{
                velocityX = Math.max(-maxVelocityX, velocityX * speedX)
            }
            vehicle.body.moveLeft(velocityX);
        }

        else if (cursors.right.isDown){
            if(velocityX <= 0){
                velocityX += 7;
            }else{
                velocityX = Math.min(maxVelocityX, velocityX * speedX)
            }
            vehicle.body.moveRight(velocityX);
        }
   }


};