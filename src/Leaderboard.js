function Game(options) {
  this.options = $.extend({
    completed: true
  }, options);

  if(this.options.winner) {
    this.options.winner.win();
  }

  this.getWinner = function() {
    if(this.options.completed == false) {
      throw new Error("Game is currently in progress");
    }
    return this.options.winner || calculateWinner.call(this);
  }

  this.getPlayer = function(i) {
    return this.options.players[i].player;
  }

  function calculateWinner() {
    if(this.options.completed == false) {
      throw new Error("Game is currently in progress");
    }
    var winner = this.options.players[0];
    for(var i = 0; i < this.options.players.length; i++) {
      if(this.options.players[i].score  > winner.score ) {
        winner = this.options.players[i];
      }
    }
    winner.player.win();
    this.options.winner = winner.player;
    return winner.player;
  }
  
  this.getScore = function(name) {
    for(var i = 0; i < this.options.players.length; i++) {
      if(this.options.players[i].player.name === name) {
        return this.options.players[i].score;
      }
    }
    throw new Error('That player is not playing in this game');
  }

  this.getRanking = function(rank) {
    this.options.players.sort(function(a, b) {
      return b.score - a.score;
    });
    return this.options.players[rank].player;
  }

  this.getFirstPlace = function() {
    return this.getRanking(0);
  }

  this.getLastPlace = function() {
    return this.getRanking(this.options.players.length - 1);
  }

  this.numPlayers = function() {
    return this.options.players.length;
  }

}

function Player(name) {
  this.name = name;
  this.wins = 0;
  this.win = function() {
    this.wins++;
  }
}

function GameLogs() {
  this.completedGames = [];
  this.inProgressGames = [];

  this.numGames = function() {
    return this.completedGames.length + this.inProgressGames.length;
  }

  this.add = function(game) {
    if(game.options.completed) {
      this.completedGames.push(game);
    }else{
      this.inProgressGames.push(game);
    }
  }

  this.numCompletedGames = function() {
    return this.completedGames.length;
  }

  this.numInProgressGames = function() {
    return this.inProgressGames.length;
  }

}

player1 = new Player("Bob");
player2 = new Player("Steve");
game = new Game({players: [{player: player1 , score: 10}, {player: player2, score: 5}]});

$(document).ready(function() {
  $(".players").append("<div>" + player1.name + " <input placeholder='score' /></div>")
  $(".players").append("<div>" + player2.name + " <input placeholder='score' /></div>")

  $("button").on("click", function() {
    var game = new Game({players: [{player: player1 , score: parseInt($('input:first').val())}, {player: player2, score: parseInt($('input:last').val())}]});
    game.getWinner();
      $("body").append("<div style='font-weight:bold;margin-top:15px;'>" + game.getRanking(0).name + " " + game.getScore(game.getRanking(0).name) + "</div>");
      $("body").append("<div>" + game.getRanking(1).name + " " + game.getScore(game.getRanking(1).name) + "</div>");
  })
});
