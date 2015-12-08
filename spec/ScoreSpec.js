describe("Score", function() {
  var player1;
  var player2;
  var game;
  var gameLogs;
  var score;

  beforeEach(function() {
    score = new Score();
    inProgressScore = new Score({ data: [new Turn(5,0), new Turn(5,5)]});
    completedScore = new Score({ data: [new Turn(5,0), new Turn(5,5), new Turn(10,0), new Turn(5,2), new Turn(1,1), new Turn(3,6), new Turn(2,2), new Turn(10,0), new Turn(9,1), new Turn(8,0)]});
  });

  describe("should get total points", function() {

    it("when 2nd to last rolled is strike", function() {
      var score = new Score({data : [new Turn(10), new Turn(2,7)]})
      expect(score.getTotalPoints()).toBe(28);
    });

    it("when 2nd last rolled is spare", function() {
      var score = new Score({data : [new Turn(5,5), new Turn(2,7)]})
      expect(score.getTotalPoints()).toBe(21);
    });

    describe("by turn", function() {

      it("when turn is strike", function() {
        var score = new Score({data : [new Turn(10), new Turn(2,7)]})
        expect(score.getPointsByTurn(1)).toBe(19);
      });

      it("when turn is spare", function() {
        var score = new Score({data : [new Turn(5,5), new Turn(2,7)]})
        expect(score.getPointsByTurn(1)).toBe(12);
      });
    });
  });

  describe("when it is new it", function() {

    it("should get 0 as total", function() {
      expect(score.getTotalPoints()).toBe(0);
    });

    it("should throw an error when try to get the score from first turn", function() {
      expect( function() { score.getPointsByTurn(1) }).toThrowError("The game has not started yet.");
    });
  });

  describe("when it is in progress it", function() {

    it("should throw an error when trying to get the score from a turn that hasn't been played yet", function() {
      expect( function() { inProgressScore.getPointsByTurn(3) }).toThrowError("That turn has not been played yet.");
    });

    it("should get total from in progress existing score", function() {
      expect(inProgressScore.getTotalPoints()).toBe(15);
    });
  });

  describe("completed", function() {

    it("should get total points", function() {
      expect(completedScore.getTotalPoints()).toBe(110);
    });

    it("should get total points from last turn", function() {
      expect(completedScore.getPointsByTurn(10)).toBe(110);
    });

    it("should get the score from the 5th turn", function() {
      expect(completedScore.getPointsByTurn(5)).toBe(51);
    });

    it("should get the score from a turn with strike which includes bonus points", function() {
      expect(completedScore.getPointsByTurn(3)).toBe(42);
    });

    it("should get the array of turns", function() {
      expect(completedScore.getTurns().length).toBe(10);
    });
  });
});