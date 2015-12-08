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

  it("should be empty on initialization", function() {
    expect(gameLogs.numGames()).toBe(0);
  });

  it("should hold 0 completed games", function() {
    gameLogs.add(inProgressGame);
    expect(gameLogs.numCompletedGames()).toBe(0);
    expect(gameLogs.numGames()).toBe(1);
  });

  it("should hold 1 in progress game", function() {
    gameLogs.add(inProgressGame);
    expect(gameLogs.numInProgressGames()).toBe(1);
    expect(gameLogs.numGames()).toBe(1);
  });

  it("should hold 1 completed game", function() {
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

describe("Player Logs", function() {
  var playerLogs;

  beforeEach(function() {
    playerLogs = new PlayerLogs();
  });

  it("should be empty on initialization", function() {
    expect(playerLogs.numPlayers()).toBe(0);
  });

  it("should add a player", function() {
    var player = new Player("Bob");
    playerLogs.add(player);
    expect(playerLogs.players).toEqual([player]);
  });

  it("should get players sorted by wins", function() {
    var oneWin = new Player("Bob");
    var twoWins = new Player("Steve"); 
    oneWin.wins = 1;
    twoWins.wins = 2;
    playerLogs.add(twoWins);
    playerLogs.add(oneWin);
    expect(playerLogs.getSortedByWins()).toEqual([twoWins, oneWin]);
  });

});
