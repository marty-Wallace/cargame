/**
 * Created by Sarah on 2/3/2017.
 *
 * The Preloader state is used to preload assets before the MainMenu is displayed. Once assets have been loaded the Preloader state
 * will start the MainMenu state
 */


Game.Preloader = function(game){


};

Game.Preloader.prototype = {
    preload:function(){

    },

    create:function(){

        this.state.start('MainMenu');
    }
};
