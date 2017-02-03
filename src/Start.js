//declare all states and start boot

window.onload = function(){

    var game = new Phaser.Game(800,600,Phaser.CANVAS,'');

    //add all the states (these are all the js files)
    game.state.add('Boot',Game.Boot);
    game.state.add('Preloader', Game.Preloader);
    game.state.add('MainMenu',Game.MainMenu);
    game.state.add('Story',Game.Story);
    game.state.add('Achievements',Game.Achievements);
    game.state.add('Game', Game.Game);

    game.state.start('Boot');
};