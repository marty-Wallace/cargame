/**
 * Created by Sarah on 2/3/2017.
 *
 * The Boot state is the first state the game enters to begin loading the game. Will load a 'loading bar' then start the
 * preloader state.
 */


var Game = {};

Game.Boot = function(game){

};

Game.Boot.prototype = {
    init:function(){

    },
    preload:function(){
        //this.load.image('preloaderBar', 'assets/preloader.png');
    },

    create:function(){
        this.state.start('Preloader');
    }
};