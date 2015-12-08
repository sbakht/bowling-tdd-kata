describe("Game", function() {
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

  it("games are considered completed by default", function() {
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

  it("should return number of players", function() {
    expect(game.numPlayers()).toBe(3);
  });
});
