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
        return this.options.players[i].score.getTotalPoints();
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

describe("Winner", function() {
  var player;
  var game;
  var game2;

  beforeEach(function() {
    player1 = new Player("Bob");
    player2 = new Player("Steve");
    winningScore = new Score({ data: [new Turn(5,0), new Turn(5,5), new Turn(10,0), new Turn(5,2), new Turn(1,1), new Turn(3,6), new Turn(2,2), new Turn(10,0), new Turn(9,1), new Turn(8,0)]});
    secondPlaceScore = new Score({ data: [new Turn(2,0), new Turn(5,5), new Turn(10,0), new Turn(5,2), new Turn(1,1), new Turn(3,6), new Turn(2,2), new Turn(10,0), new Turn(9,1), new Turn(8,0)]});
    thirdPlaceScore = new Score({ data: [new Turn(0,0), new Turn(5,5), new Turn(10,0), new Turn(5,2), new Turn(1,1), new Turn(3,6), new Turn(2,2), new Turn(10,0), new Turn(9,1), new Turn(8,0)]});
    game = new Game({players: [{player: player1 , score: winningScore}, {player: new Player("Ashe"), score: thirdPlaceScore}, {player: player2, score: secondPlaceScore}]});
    game2 = new Game({players: [{player: player1 , score: new Score({ data: [4]})}, {player: player2, score: new Score({ data: [1]})}]});
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
    expect(game.getScore("Bob")).toBe(110);
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
    inProgressGame = new Game({completed: false, players: [{player: player1 , score: new Score({ data: [5, 10]})}, {player: new Player("Ashe"), score: new Score({ data: [1, 2]})}, {player: player2, score: new Score({ data: [5]})}]});
  });

  it("should be empty by default", function() {
    expect(gameLogs.numGames()).toBe(0);
  });

  it("should hold 0 completed games", function() {
    gameLogs.add(inProgressGame);
    expect(gameLogs.numCompletedGames()).toBe(0);
    expect(gameLogs.numGames()).toBe(1);
  });

  it("should hold 1 in progress games", function() {
    gameLogs.add(inProgressGame);
    expect(gameLogs.numInProgressGames()).toBe(1);
  });

  it("should hold 1 completed games", function() {
    gameLogs.add(new Game());
    expect(gameLogs.numCompletedGames()).toBe(1);
    expect(gameLogs.numGames()).toBe(1);
  });

  it("should hold 2 games (1 completed and 1 in progress)", function() {
    gameLogs.add(inProgressGame);
    gameLogs.add(new Game());
    expect(gameLogs.numGames()).toBe(2);
  });
});

var Score = function(options) {
  this.options = $.extend({
  }, options);
  this.getTotalPoints = function() {
    if(this.options.data) {
      return calculateTotal.call(this);
    }
    return 0;
  }

  this.getPointsByTurn = function(turn) {
    if(this.options.data == undefined) {
      throw new Error("The game has not started yet.");
    }
    if(this.options.data[turn] == undefined) {
      throw new Error("That turn has not been played yet.");
    }
    return calculateTotal.call(this, turn);
  }

  function calculateTotal(turn) {
    var total = 0;
    var strike = false;
    var spare = false;
    if(turn == undefined) {
      turn = this.options.data.length;
    }

    for(var i = 0; i < turn; i++) {
      total += this.options.data[i].getTotal();
      if(strike) {
        total += this.options.data[i].getTotal();
        strike = false;
      }else if(spare) {
        total += this.options.data[i].firstRoll;
        spare = false;
      }
      if(this.options.data[i].firstRoll == 10) {
        strike = true;
      }else if(this.options.data[i].firstRoll + this.options.data[i].secondRoll == 10) {
        spare = true;
      }
    }
    return total;
  }
}

describe("Score", function() {
  var player1;
  var player2;
  var game;
  var gameLogs;
  var score;

  beforeEach(function() {
    gameLogs = new GameLogs();
    score = new Score();
    inProgressScore = new Score({ data: [new Turn(5,0), new Turn(5,5), new Turn(10,0), new Turn(5,2), new Turn(1,1), new Turn(3,6)]});
    completedScore = new Score({ data: [new Turn(5,0), new Turn(5,5), new Turn(10,0), new Turn(5,2), new Turn(1,1), new Turn(3,6), new Turn(2,2), new Turn(10,0), new Turn(9,1), new Turn(8,0)]});
  });

  describe("new", function() {


    it("should get 0 as total from new score", function() {
      expect(score.getTotalPoints()).toBe(0);
    });

    it("should throw an error when try to get the score from first turn on a new score", function() {
      expect( function() { score.getPointsByTurn(1) }).toThrowError("The game has not started yet.");
    });
  });

  describe("in progress", function() {

    it("should throw an error when try to get the score from a turn that hasn't been played yet", function() {
      expect( function() { inProgressScore.getPointsByTurn(6) }).toThrowError("That turn has not been played yet.");
    });

    it("should get total from in progress existing score", function() {
      expect(inProgressScore.getTotalPoints()).toBe(60);
    });
  });

  describe("completed", function() {

    it("should get total from completed existing score", function() {
      expect(completedScore.getTotalPoints()).toBe(110);
    });

    it("should get the score from the 5th turn on an existing score", function() {
      expect(completedScore.getPointsByTurn(5)).toBe(51);
    });
  });
});


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

describe("Turn", function() {
  var turn;
  beforeEach(function() {
    turn = new Turn();
  });

  it("should create a new Turn", function() {
    expect(turn).toBeDefined();
  });

  it("should add first roll", function() {
    turn.setFirstRoll(5);
    expect(turn.firstRoll).toBe(5);
  });

  it("should add second roll", function() {
    turn.firstRoll = 0;
    turn.setSecondRoll(5);
    expect(turn.secondRoll).toBe(5);
  });

  it("should add first and second rolls using setRolls", function() {
    turn.setRolls(5,5);
    expect(turn.getTotal()).toBe(10);
  });

  describe("total", function() {

    it("should get total after first roll", function() {
      turn.setFirstRoll(5);
      expect(turn.getTotal()).toBe(5);
    });

    it("should get total when both roll points are 0", function() {
      turn.setFirstRoll(0);
      turn.setSecondRoll(0);
      expect(turn.getTotal()).toBe(0);
    });

    it("should get total when first is strike", function() {
      turn.setFirstRoll(10);
      expect(turn.getTotal()).toBe(10);
    });
  });

  describe("Error", function() {

    describe("when incorrect pin count", function() {

      it("should throw error when first roll is less then 0", function() {
        expect(function() {turn.setFirstRoll(-1) }).toThrowError("Invalid # of pins knocked");
      });

      it("should throw error when first roll is greater then 10", function() {
        expect(function() {turn.setFirstRoll(11) }).toThrowError("Invalid # of pins knocked");
      });

      it("should throw error when second roll is less then 0", function() {
        turn.firstRoll = 0;
        expect(function() {turn.setSecondRoll(-1) }).toThrowError("Invalid # of pins knocked");
      });

      it("should throw error when second roll is greater then 10", function() {
        turn.firstRoll = 0;
        expect(function() {turn.setSecondRoll(11) }).toThrowError("Invalid # of pins knocked");
      });

      it("should throw error when second roll is greater then # of pins left", function() {
        turn.firstRoll = 5;
        expect(function() {turn.setSecondRoll(6) }).toThrowError("Invalid # of pins knocked");
      });

    });

    it("should throw error if try to add second roll without first roll", function() {
      expect(function() {turn.setSecondRoll(5) }).toThrowError("Must make first roll before second roll.");
    });

    it("should throw error when try to make 2nd throw when first is strike", function() {
      turn.setFirstRoll(10);
      expect(function() {turn.setSecondRoll(5) }).toThrowError("Can't make second roll - first was a strike");
    });

    it("should throw error if try to get total when no roll was made", function() {
      expect(function() {turn.getTotal() }).toThrowError("No rolls have been made for this turn.");
    });
  });
});
