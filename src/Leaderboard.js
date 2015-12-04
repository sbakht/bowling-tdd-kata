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

  this.getPlayers = function() {
    return this.options.players;
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
      if(this.options.players[i].score.getTotalPoints()  > winner.score.getTotalPoints() ) {
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
      return b.score.getTotalPoints() - a.score.getTotalPoints();
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
var temp = 0;
var Score = function(options) {
  this.options = $.extend({
  }, options);
  this.getTotalPoints = function() {
    if(this.options.data) {
      return calculateTotal.call(this);
    }
    return 0;
  }

  this.getPointsByTurn = function(numTurnForTotal) {
    if(this.options.data == undefined) {
      throw new Error("The game has not started yet.");
    }
    if(this.options.data[numTurnForTotal - 1] == undefined) {
      throw new Error("That turn has not been played yet.");
    }
    return calculateTotal.call(this, numTurnForTotal);
  }

  this.getTurns = function() {
    return this.options.data;
  }

  function calculateTotal(numTurnForTotal) {
    var total = 0;
    var turns = this.options.data;
    var turn, lastTurn;
    
    if(numTurnForTotal == undefined) {
      numTurnForTotal = turns.length;
    }

    if(turns[numTurnForTotal - 1].getTotal() == 10 && turns[numTurnForTotal] != undefined) {
      numTurnForTotal += 1;
    }

    for(var i = 0; i < numTurnForTotal; i++) {
      turn = turns[i];
      total += turn.getTotal();

      if(isStrike(lastTurn)) {
        total += turn.getTotal();
      }else if(isSpare(lastTurn)) {
        total += turn.firstRoll;
      }

      lastTurn = turn;
    }
    return total;
  }

  function isStrike(turn) {
    if(turn && turn.firstRoll == 10) {
      return true;
    }
    return false;
  }

  function isSpare(turn) {
    if(turn && turn.firstRoll != 10 && turn.getTotal() == 10) {
      return true;
    }
    return false;
  }

}


function Turn(firstRoll, secondRoll, options) {
  this.options = $.extend({
  }, options);
  this.firstRoll = firstRoll;
  this.secondRoll = secondRoll;

  this.setRolls = function(first, second) {
    if(first != undefined) {
      this.setFirstRoll(first);
    }
    if(second != undefined) {
      this.setSecondRoll(second);
    }
  }

  this.setFirstRoll = function(points) {
    if(points < 0 || points > 10) {
      throw new Error("Invalid # of pins knocked");
    }
    this.firstRoll = points;
  }

  this.setSecondRoll = function(points) {
    if(this.firstRoll == undefined) {
      throw new Error("Must make first roll before second roll.");
    }
    if(this.firstRoll == 10) {
      throw new Error("Can't make second roll - first was a strike");
    }
    if(points < 0 || points > (10 - this.firstRoll)) {
      throw new Error("Invalid # of pins knocked");
    }
    this.secondRoll = points; 
  }

  this.getTotal = function() {
    if(this.firstRoll == undefined) {
      throw new Error("No rolls have been made for this turn.")
    }
    return this.firstRoll + this.secondRoll || this.firstRoll;
  }
}

player1 = new Player("Bob");
player2 = new Player("Steve");
game = new Game({players: [{player: player1 , score: new Score({data : [new Turn(), new Turn(), new Turn(), new Turn(), new Turn(), new Turn(), new Turn(), new Turn(), new Turn(), new Turn() ]} )}, {player: player2, score: new Score({data : [new Turn(), new Turn(), new Turn(), new Turn(), new Turn(), new Turn(), new Turn(), new Turn(), new Turn(), new Turn() ]}) } ]});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function playGame(players) {
  var firstRoll;
  var turns;
    for(var x = 0; x < players.length; x++) {
      for(var i = 0; i < players[x].score.getTurns().length; i++) {
        turns = players[x].score.getTurns();
        firstRoll = getRandomInt(0,11);
        turns[i].setFirstRoll(firstRoll);
        if(firstRoll != 10) {
          turns[i].setSecondRoll(getRandomInt(0, 11-firstRoll));
        }
      }
   }
}

function displayWinnerName(game) {
   $(".winner").html("Winner: " + game.getWinner().name);
}

function PlayerView(player) {
  this.player = player;

  this.displayPlayerName = function() {
      var $scores = $(".scores");
      $scores.append("<p class='score'><span style='font-weight:bold;'>" + this.player.name + "</span> </p>");
    }
}

function ScoreView(score) {
  this.score = score;

  this.displayTurns = function() {
    for(var i = 1; i <= 10; i++) { 
      this.displayTurnByNum(i);
    }
  }

  this.displayTurnByNum = function(numTurn) {
    var $elem = $("<div class='turn turn" + numTurn + "'</div>");
    $elem.append(this.score.getPointsByTurn(numTurn));
    $elem.append(this.score.getTurns()[numTurn - 1].firstRoll);
    $elem.append(this.score.getTurns()[numTurn - 1].secondRoll);
    $elem.appendTo($(".scores:last"));
  }
}


function onClick() {
  var firstRoll;
  var turns;
  game = new Game({players: [{player: player1 , score: new Score({data : [new Turn(), new Turn(), new Turn(), new Turn(), new Turn(), new Turn(), new Turn(), new Turn(), new Turn(), new Turn() ]} )}, {player: player2, score: new Score({data : [new Turn(), new Turn(), new Turn(), new Turn(), new Turn(), new Turn(), new Turn(), new Turn(), new Turn(), new Turn() ]}) } ]});
  var players = game.getPlayers();
  displayPlayerNames(players);
  playGame(players);
  displayTurns(players);
  displayWinnerName(game);
}

$(document).ready(function() {
  $(".players").append("<div>" + player1.name + " <input placeholder='score' /></div>")
  $(".players").append("<div>" + player2.name + " <input placeholder='score' /></div>")
  $("button.add").on("click", onClick);

  $("button.getWinner").on("click", function() {
    var game = new Game({players: [{player: player1 , score: parseInt($('input:first').val())}, {player: player2, score: parseInt($('input:last').val())}]});
    game.getWinner();
      $("body").append("<div style='font-weight:bold;margin-top:15px;'>" + game.getRanking(0).name + " " + game.getScore(game.getRanking(0).name) + "</div>");
      $("body").append("<div>" + game.getRanking(1).name + " " + game.getScore(game.getRanking(1).name) + "</div>");
  })
});
