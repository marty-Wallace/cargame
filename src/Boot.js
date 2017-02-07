/**
 * Created by Sarah on 2/3/2017.
 *
 * The Boot state is the first state the game enters to begin loading the game. Will load a 'loading bar' then start the
 * preloader state.
 */


var Game = {};

Game.Boot = function(game) { };

Game.Boot.prototype = {

    init: function(){

    },

    preload: function(){
        this.stage.backgroundColor = '#000000';
        this.load.image('loading-background', 'assets/img/loading-background.png');
        this.load.image('loading-progress', 'assets/img/loading-progress.png');
    },

    create: function(){

        this.input.maxPointers = 1;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.parentIsWindow = true;
        this.scale.minWidth = 270;
        this.scale.minHeight = 480;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.state.forcePortrait = true;
        this.scale.updateLayout(true);

        this.input.addPointer();
        this.stage.backgroundColor = '#000000';

        this.state.start('Preloader');
    },


    _playAudio: function() {

    }
};