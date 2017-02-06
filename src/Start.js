/**
 * Created by Sarah on 2/3/2017.
 *
 * Start.js creates the Phaser game object, adds all of the states to the game object then starts the Boot state.
 */

window.onload = function(){

    var game = new Phaser.Game(640, 960, Phaser.CANVAS, 'ProjectX');

    //add all the states (these are all the js files)
    game.state.add('Boot',Game.Boot);
    game.state.add('Preloader', Game.Preloader);
    game.state.add('MainMenu',Game.MainMenu);
    game.state.add('Story',Game.Story);
    game.state.add('Achievements',Game.Achievements);
    game.state.add('Game', Game.Game);

    game.state.start('Boot');
};