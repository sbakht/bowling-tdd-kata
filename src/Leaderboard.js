function Game(options) {
  this.options = $.extend({
    inProgress: false
  }, options);

  this.getWinner = function() {
    if(this.options.inProgress) {
      throw new Error("Game is currently in progress");
    }
    return this.options.winner || calculateWinner.call(this);
  }

  this.getPlayer = function(i) {
    return this.options.players[i].player;
  }

  function calculateWinner() {
    var winner = this.options.players[0];
    for(var i = 0; i < this.options.players.length; i++) {
      if(this.options.players[i].score  > winner.score ) {
        winner = this.options.players[i];
      }
    }
    return winner.player.name;
  }
  
  this.getScore = function(name) {
    for(var i = 0; i < this.options.players.length; i++) {
      if(this.options.players[i].player.name === name) {
        return this.options.players[i].score;
      }
    }
    throw new Error('That player is not playing in this game');
  }

}

function Player(name) {
  this.name = name;
}

    player1 = new Player("Bob");
    player2 = new Player("Steve");
game = new Game({players: [{player: player1 , score: 10}, {player: player2, score: 5}]});

$("body").append("<div>hi</div>");
