describe("Turn", function() {
  var turn;
  beforeEach(function() {
    turn = new Turn();
  });

  it("should create a new empty Turn", function() {
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

  it("should check if strike", function() {
    turn = new Turn(5,4);
    expect(turn.isStrike()).toBeFalsy();
    turn = new Turn(10);
    expect(turn.isStrike()).toBeTruthy();
  });

  it("should check if spare", function() {
    turn = new Turn(5,4);
    expect(turn.isSpare()).toBeFalsy();
    turn = new Turn(5,5);
    expect(turn.isSpare()).toBeTruthy();
  });

  it("should add boths rolls at once", function() {
    turn.setRolls(4,6);
    expect(turn.firstRoll).toBe(4);
    expect(turn.secondRoll).toBe(6);
  });

  describe("should get its total", function() {

    it("when first roll is set", function() {
      turn.firstRoll = 5;
      expect(turn.getTotal()).toBe(5);
    });

    it("when both rolls are set", function() {
      turn.firstRoll = 4;
      turn.secondRoll = 5;
      expect(turn.getTotal()).toBe(9);
    });

    it("when both roll points are 0", function() {
      turn.firstRoll = 0;
      turn.secondRoll = 0;
      expect(turn.getTotal()).toBe(0);
    });

    it("when first roll is strike", function() {
      turn.firstRoll = 10;
      expect(turn.getTotal()).toBe(10);
    });

  });

  describe("should throw error", function() {

    describe("when incorrect pin count", function() {

      it("when first roll is less then 0", function() {
        expect(function() {turn.setFirstRoll(-1) }).toThrowError("Invalid # of pins knocked");
      });

      it("when first roll is greater then 10", function() {
        expect(function() {turn.setFirstRoll(11) }).toThrowError("Invalid # of pins knocked");
      });

      it("when second roll is less then 0", function() {
        turn.firstRoll = 0;
        expect(function() {turn.setSecondRoll(-1) }).toThrowError("Invalid # of pins knocked");
      });

      it("when second roll is greater then 10", function() {
        turn.firstRoll = 0;
        expect(function() {turn.setSecondRoll(11) }).toThrowError("Invalid # of pins knocked");
      });

      it("when second roll is greater then # of pins left", function() {
        turn.firstRoll = 5;
        expect(function() {turn.setSecondRoll(6) }).toThrowError("Invalid # of pins knocked");
      });

      it("when you try to get the total when no roll was made", function() {
        expect(function() { turn.getTotal() }).toThrowError('No rolls have been made for this turn.');
      });

    });

    it("when you try to add second roll without adding first roll", function() {
      expect(function() {turn.setSecondRoll(5) }).toThrowError("Must make first roll before second roll.");
    });

    it("when you try to add second roll when first roll is strike", function() {
      turn.firstRoll = 10;
      expect(function() {turn.setSecondRoll(5) }).toThrowError("Can't make second roll - first was a strike");
    });

  });
});
