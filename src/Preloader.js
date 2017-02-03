Game.Preloader = function(game){


};

Game.Preloader.prototype = {
    preload:function(){

    },

    create:function(){

        this.state.start('MainMenu');
    }
};
