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
    game2 = new Game({players: [{player: player1 , score: winningScore}, {player: player2, score: secondPlaceScore}]});
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

  it("should return all the players", function() {
    expect(game.getPlayers().length).toBe(3);
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
    expect(game.getScore("Bob").getTotalPoints()).toBe(110);
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


    it("should get total points when last rolled is strike", function() {
      var score = new Score({data : [new Turn(10), new Turn(2,7)]})
      expect(score.getTotalPoints()).toBe(28);
    });

    it("should get total points when last rolled is spare", function() {
      var score = new Score({data : [new Turn(5,5), new Turn(2,7)]})
      expect(score.getTotalPoints()).toBe(21);
    });

    it("should get total points by roll num when is strike", function() {
      var score = new Score({data : [new Turn(10), new Turn(2,7)]})
      expect(score.getPointsByTurn(1)).toBe(19);
    });

    it("should get total points by roll num when is spare", function() {
      var score = new Score({data : [new Turn(5,5), new Turn(2,7)]})
      expect(score.getPointsByTurn(1)).toBe(12);
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
      expect( function() { inProgressScore.getPointsByTurn(7) }).toThrowError("That turn has not been played yet.");
    });

    it("should get total from in progress existing score", function() {
      expect(inProgressScore.getTotalPoints()).toBe(60);
    });
  });

  describe("completed", function() {

    it("should get total from completed existing score", function() {
      expect(completedScore.getTotalPoints()).toBe(110);
    });

    it("should getTotalPoints() === getPointsByTurn(10)", function() {
      expect(completedScore.getPointsByTurn(10)).toBe(110);
    });

    it("should get the score from the 5th turn on an existing score", function() {
      expect(completedScore.getPointsByTurn(5)).toBe(51);
    });

    it("should get the score from a turn with strike which includes bonus", function() {
      expect(completedScore.getPointsByTurn(3)).toBe(42);
    });

    it("should get the array of turns", function() {
      expect(completedScore.getTurns().length).toBe(10);
    });
  });
});


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

      it("should throw error when try to get total when no roll was made", function() {
        expect(function() { turn.getTotal() }).toThrowError('No rolls have been made for this turn.');
      });

    });

    it("should throw error if try to add second roll without first roll", function() {
      expect(function() {turn.setSecondRoll(5) }).toThrowError("Must make first roll before second roll.");
    });

    it("should throw error when try to make 2nd throw when first is strike", function() {
      turn.setFirstRoll(10);
      expect(function() {turn.setSecondRoll(5) }).toThrowError("Can't make second roll - first was a strike");
    });

  });
});

describe("Html", function() {
  var game;
  var player1;
  var player2;
  beforeEach(function() {
    setFixtures('<button class="add"></button><div class="scores"></div><div class="winner"></div>');
    player1 = new Player("Bob");
    player2 = new Player("Steve");
    game = new Game({players: [{player: player1 , score: new Score({data : [new Turn(), new Turn(), new Turn(), new Turn(), new Turn(), new Turn(), new Turn(), new Turn(), new Turn(), new Turn() ]} )}, {player: player2, score: new Score({data : [new Turn(), new Turn(), new Turn(), new Turn(), new Turn(), new Turn(), new Turn(), new Turn(), new Turn(), new Turn() ]}) } ]});

    $("button.add").on("click", onClick);
  });

  it("jasmine-jquery should work", function() {
    expect($('button')).toBeInDOM();
  });

  describe("after playthrough of match", function() {

    it("should show players names", function() {
      var players = game.getPlayers();
      var playerView1 = new PlayerView(players[0].player);
      var playerView2 = new PlayerView(players[1].player);
      playerView1.displayPlayerName();
      playerView2.displayPlayerName();
      expect($(".scores")).toContainText("Bob");
      expect($(".scores")).toContainText("Steve");
    });

    it("should show the players first turn score", function() {
      var game = new Game({players: [{player: player1 , score: new Score({data : [new Turn(5,0), new Turn(5,5), new Turn(10,0), new Turn(5,2), new Turn(1,1), new Turn(3,6), new Turn(2,2), new Turn(10,0), new Turn(9,1), new Turn(8,0)]} )}, {player: player2, score: new Score({data : [new Turn(10,0), new Turn(5,5), new Turn(10,0), new Turn(5,2), new Turn(1,1), new Turn(3,6), new Turn(2,2), new Turn(10,0), new Turn(9,1), new Turn(8,0)]}) } ]});
      var players = game.getPlayers();
      var scoreView1 = new ScoreView(players[0].score);
      var scoreView2 = new ScoreView(players[1].score);
      scoreView1.displayTurnByNum(1);
      scoreView2.displayTurnByNum(1);
      expect($(".turn.turn1")).toContainText(5);
      expect($(".turn.turn1")).toContainText(20);
    });

    it("should throw error when try to display total for a roll that is strike when next roll hasn't been done", function() {
      var score = new Score({ data: [new Turn(10), new Turn()]});
      var scoreView = new ScoreView(score);
      expect(function() { scoreView.displayTurnByNum(1) }).toThrowError('No rolls have been made for this turn.');
    });

    it("should show the players first turn roll points", function() {
      var game = new Game({players: [{player: player1 , score: new Score({data : [new Turn(5,0), new Turn(5,5), new Turn(10,0), new Turn(5,2), new Turn(1,1), new Turn(3,6), new Turn(2,2), new Turn(10,0), new Turn(9,1), new Turn(8,0)]} )}, {player: player2, score: new Score({data : [new Turn(10,0), new Turn(5,5), new Turn(10,0), new Turn(5,2), new Turn(1,1), new Turn(3,6), new Turn(2,2), new Turn(10,0), new Turn(9,1), new Turn(8,0)]}) } ]});
      var players = game.getPlayers();
      var scoreView1 = new ScoreView(players[0].score);
      var scoreView2 = new ScoreView(players[1].score);
      scoreView1.displayTurnByNum(1);
      scoreView2.displayTurnByNum(1);
      expect($(".turn.turn1")).toContainText(5);
      expect($(".turn.turn1")).toContainText(0);
      expect($(".turn.turn1")).toContainText(10);
      expect($(".turn.turn1")).not.toContainText('undefined');
    });

    it("should show the players final turn score", function() {
      var players = game.getPlayers();
      playGame(players);
      var scoreView1 = new ScoreView(players[0].score);
      var scoreView2 = new ScoreView(players[1].score);
      scoreView1.displayTurnByNum(10);
      scoreView2.displayTurnByNum(10);
      expect($(".turn.turn10")).toContainText(players[0].score.getTotalPoints());
      expect($(".turn.turn10")).toContainText(players[1].score.getTotalPoints());
    });

    it("should show scores for all turns of a player", function() {
      var players = game.getPlayers();
      playGame(players);
      var scoreView1 = new ScoreView(players[0].score);
      var scoreView2 = new ScoreView(players[1].score);
      scoreView1.displayTurns();
      scoreView2.displayTurns();
      expect($(".turn.turn1")).toContainText(players[0].score.getPointsByTurn(1));
      expect($(".turn.turn2")).toContainText(players[0].score.getPointsByTurn(2));
      expect($(".turn.turn3")).toContainText(players[0].score.getPointsByTurn(3));
      expect($(".turn.turn4")).toContainText(players[0].score.getPointsByTurn(4));
      expect($(".turn.turn5")).toContainText(players[0].score.getPointsByTurn(5));
      expect($(".turn.turn6")).toContainText(players[0].score.getPointsByTurn(6));
      expect($(".turn.turn7")).toContainText(players[0].score.getPointsByTurn(7));
      expect($(".turn.turn8")).toContainText(players[0].score.getPointsByTurn(8));
      expect($(".turn.turn9")).toContainText(players[0].score.getPointsByTurn(9));
      expect($(".turn.turn10")).toContainText(players[0].score.getPointsByTurn(10));
    });

    it("should show the winners name", function() {
      var players = game.getPlayers();
      playGame(players);
      displayWinnerName(game);
      expect($(".winner")).toContainText(game.getWinner().name);
    });
  });
});

