/**
 * Created by Marty on 2/3/2017.
 *
 * The MainMenu state is used to display the games rules/instructions as well as providing a link to the terms and conditions of the game.
 * The main menu will provide a start button which upon being pressed will load the Story state.
 */

Game.MainMenu = function(game) { };

Game.MainMenu.prototype = {

    init:function(){

    },

    preload:function(){

    },

    create:function(){

        var buttonStart = this.add.button(this.world.width-20, this.world.height-20, 'button-start', this.clickStart, this, 1, 0, 2);
        buttonStart.anchor.set(1);

        this.state.start('Game');
    },

    clickStart: function() {
        //Game._playAudio('click');
        this.camera.fade(0, 200, false);
        this.time.events.add(200, function() {
            this.state.start('Game');
        }, this);
    }
};