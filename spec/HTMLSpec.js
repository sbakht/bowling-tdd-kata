describe("HTML", function() {
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

  describe("when displaying match scores it", function() {

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
      var game = new Game({players: [{player: player1 , score: new Score({data : [new Turn(10,0), new Turn(5,5), new Turn(10,0), new Turn(5,2), new Turn(1,1), new Turn(3,6), new Turn(2,2), new Turn(10,0), new Turn(9,1), new Turn(8,0)]} )}, {player: player2, score: new Score({data : [new Turn(10,0), new Turn(5,5), new Turn(10,0), new Turn(5,2), new Turn(1,1), new Turn(3,6), new Turn(2,2), new Turn(10,0), new Turn(9,1), new Turn(8,0)]}) } ]});
      var players = game.getPlayers();
      var scoreView1 = new ScoreView(players[0].score);
      scoreView1.displayTurnByNum(1);
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
      expect($(".turn.turn1:first .roll1")).toHaveText(5);
      expect($(".turn.turn1:last .roll1")).toHaveText("X");
      expect($(".turn.turn1:last .roll2")).toHaveText("");
    });

    it("should show X in roll 1 slot when strike", function() {
      var score = new Score({data: [new Turn(10)]});
      var scoreView = new ScoreView(score);
      scoreView.displayTurnByNum(1);
      expect($(".turn.turn1 .roll1")).toHaveText('X');
    });

    it("should show nothing in roll 2 slot when strike", function() {
      var score = new Score({data: [new Turn(10)]});
      var scoreView = new ScoreView(score);
      scoreView.displayTurnByNum(1);
      expect($(".turn.turn1 .roll2")).toHaveText('');
    });

    it("should show / in roll 2 slot when spare", function() {
      var score = new Score({data: [new Turn(5,5)]});
      var scoreView = new ScoreView(score);
      scoreView.displayTurnByNum(1);
      expect($(".turn.turn1 .roll2")).toHaveText('/');
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
      expect($(".winner")).toHaveText("Winner: " + game.getWinner().name);
    });
  });
});

