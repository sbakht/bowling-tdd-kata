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

describe("Winner", function() {
  var player;
  var game;

  beforeEach(function() {
    player1 = new Player("Bob");
    player2 = new Player("Steve");
    game = new Game({players: [{player: player1 , score: 10}, {player: new Player("Ashe"), score: 3}, {player: player2, score: 5}]});
  });

  it("should create a game", function() {
    expect(game).toBeDefined();
  });

  it("games are considered completed by defualt", function() {
    expect(game.options.completed).toBeTruthy();
  });


  it("should return the first player", function() {
    expect(game.getPlayer(0).name).toBe("Bob");
  });

  it("should return who won a game when winner is passed in", function() {
    game = new Game({winner: player1})
    expect(game.getWinner().name).toBe("Bob");
  });

  it("should return who won a game when winner is not passed in", function() {
    expect(game.getWinner().name).toBe("Bob");
  });

  it("should throw an error when trying to get winner while game is in progress", function() {
    game = new Game({completed: false});
    expect(function() {game.getWinner() }).toThrowError("Game is currently in progress");
  });

  it("should return a players score by name", function() {
    expect(game.getScore("Bob")).toBe(10);
  });

  it("should throw an error when trying to find a players score that isn't playing", function() {
    expect(function() { game.getScore("Sam") }).toThrowError("That player is not playing in this game");
  });

  it("new player should have 0 wins", function() {
    expect(player1.wins).toBe(0);
  });

  it("player should have 1 win by calling the players win function", function() {
    player1.win();
    expect(player1.wins).toBe(1);
  });

  it("player should have 1 win by calculating winner", function() {
    game.getWinner();
    game.getWinner();
    expect(player1.wins).toBe(1);
  });

  it("player should have 1 win by passing in the player as winner", function() {
    game = new Game({winner: player1});
    expect(player1.wins).toBe(1);
  });

  it("player should have 2 wins from 2 different games", function() {
    var game2 = new Game({players: [{player: player1 , score: 4}, {player: player2, score: 1}]});
    game.getWinner();
    game2.getWinner();
    expect(player1.wins).toBe(2);
  });

  it("should return player in first place", function() {
    expect(game.getFirstPlace().name).toBe("Bob");
  });

  it("should return player in 2nd place", function() {
    expect(game.getRanking(1).name).toBe("Steve");
  });

  it("should return player in last place", function() {
    expect(game.getLastPlace().name).toBe("Ashe");
  });

  it("should return player currently in first place while game is in progress", function() {
    game.options.completed = true;
    expect(game.getFirstPlace().name).toBe("Bob");
  });

  it("should return number of players", function() {
    expect(game.numPlayers()).toBe(3);
  });

  it("should return number of players", function() {
    expect(game.numPlayers()).toBe(3);
  });

});

describe("Game Logs", function() {
  var player;
  var game;
  var gameLogs;

  beforeEach(function() {
    gameLogs = new GameLogs();
    player1 = new Player("Bob");
    player2 = new Player("Steve");
    game = new Game({completed: false, players: [{player: player1 , score: 10}, {player: new Player("Ashe"), score: 3}, {player: player2, score: 5}]});
  });

  it("should be empty by default", function() {
    expect(gameLogs.numGames()).toBe(0);
  });

  it("should hold 2 games (1 completed and 1 in progress)", function() {
    gameLogs.add(game);
    gameLogs.add(new Game());
    expect(gameLogs.numGames()).toBe(2);
  });

  it("should hold 1 in progress games", function() {
    gameLogs.add(game);
    expect(gameLogs.numInProgressGames()).toBe(1);
  });

  it("should hold 0 completed games", function() {
    gameLogs.add(game);
    expect(gameLogs.numCompletedGames()).toBe(0);
    expect(gameLogs.numGames()).toBe(1);
  });

  it("should hold 1 completed games", function() {
    gameLogs.add(new Game());
    expect(gameLogs.numCompletedGames()).toBe(1);
    expect(gameLogs.numGames()).toBe(1);
  });

});
