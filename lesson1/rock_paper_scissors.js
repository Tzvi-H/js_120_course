const READLINE = require('readline-sync');

function createPlayer() {
  return {
    move: null,
    score: 0,

    incrementScore() {
      this.score += 1;
    },

    resetScore() {
      this.score = 0;
    },
  };
}

function createComputer() {
  let computerObject = createPlayer();
  computerObject.winningHistory = [];

  computerObject.choose = function(moves) {
    let options = moves.concat(this.winningHistory);
    let randomIndex = Math.floor(Math.random() * options.length);
    this.move = createMove(options[randomIndex]);
  };

  computerObject.updateWinningMoves = function(winner) {
    if (winner === 'computer')  this.winningHistory.push(this.move.type);
  };

  return computerObject;
}

function createHuman() {
  let humanObject = createPlayer();

  humanObject.choose = function(moves) {
    let choice;
    while (true) {
      console.log('\nPlease choose a move');
      moves.forEach(move => console.log(`'${move.slice(0, 2)}' for ${move}`));
      choice = READLINE.prompt().toLowerCase();
      choice = moves.find(mv => mv === choice || mv.slice(0, 2) === choice);
      if (choice) break;
      console.log('\nSorry, invalid choice.');
    }
    this.move = createMove(choice);
  };

  return humanObject;
}

function createMove(type) {
  return {
    type,

    compare(otherMove, combos) {
      if (combos[this.type].includes(otherMove.type)) {
        return 1;
      } else if (combos[otherMove.type].includes(this.type)) {
        return -1;
      } else {
        return 0;
      }
    }
  }
}

function createRules() {
  return {
    instructions: "Scissors cuts paper, paper covers rock, rock crushes lizard, lizard poisons Spock, Spock smashes scissors, scissors decapitates lizard, lizard eats paper, paper disproves Spock, Spock vaporizes rock, and as it always has, rock crushes scissors.",
    winningScore: 5,
    moves: ['lizard', 'rock', 'paper', 'scissors', 'spock'],
    winningCombos: {
      rock:     ['lizard', 'scissors'],
      paper:    ['rock', 'spock'],
      scissors: ['paper', 'lizard'],
      spock:    ['scissors', 'rock'],
      lizard:   ['spock', 'paper']
    },
  }
}

function createHistory() {
  return {
    humanMoves: [],
    computerMoves: [],
    winningMoves: [],

    display() {
      console.log('Last 10 rounds')
      this.humanMoves.slice(0, 10).forEach((move, index) => {
        console.log(`${index + 1}. ${move}/${this.computerMoves[index]}` + 
                    ` => ${this.winningMoves[index]}`);
      });
    }
  }
}

let RPSGame = {
  rules: createRules(),
  history: createHistory(),
  human: createHuman(),
  computer: createComputer(),

  capitalizeMoves() {
    return this.rules
               .moves
               .map(move => move[0].toUpperCase() + move.slice(1))
               .join(' ');
  },

  displayWelcomeMessage() {
    console.clear();
    console.log(`Welcome to ${this.capitalizeMoves()}!`);
    console.log(this.rules.instructions);
    console.log(`\nFirst to score ${this.rules.winningScore} wins the game`);
  },

  displayGoodbyeMessage() {
    console.log('\nThanks for playing. Goodbye!');
  },

  winningScoreReached() {
    return (this.human.score === this.rules.winningScore) ||
           (this.computer.score === this.rules.winningScore);
  },

  resetScores() {
    this.human.resetScore();
    this.computer.resetScore();
  },

  calculateWinner() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;
    let combos = this.rules.winningCombos;
    switch (humanMove.compare(computerMove, combos)) {
      case 1:  return 'human';
      case -1: return 'computer';
      default: return 'tie';
    }
  },

  updateScore(winner) {
    if (winner !== 'tie') this[winner].incrementScore();
  },

  updateHistory(winner) {
    this.history.humanMoves.unshift(this.human.move.type);
    this.history.computerMoves.unshift(this.computer.move.type);
    this.history.winningMoves.unshift(winner);
  },

  displayChosenMoves() {
    console.clear();
    console.log(`You chose: ${this.human.move.type}`);
    console.log(`Computer chose: ${this.computer.move.type}\n`);
  },

  displayWinner(winner) {
    let humanMove = this.human.move.type;
    let computerMove = this.computer.move.type;
    switch (winner) {
      case 'human':
        console.log(`${humanMove} beats ${computerMove}\nYou win!`);
        break;
      case ('computer'):
        console.log(`${computerMove} beats ${humanMove}\nThe Computer wins!`);
        break;
      default:
        console.log("It's a tie!");
    }
  },

  displayScore() {
    console.log(`\nHuman score: ${this.human.score}`);
    console.log(`Computer score: ${this.computer.score}\n`);
  },

  displayGameWinner() {
    let winningScore = this.rules.winningScore
    if (this.human.score === winningScore) {
      console.log(`\nYou win the game!`)
    } else {
      console.log(`\nYou lose the game!`);
    }
  },

  playAgain() {
    let choice;
    while (true) {
      console.log('Do you want to play again?');
      choice = READLINE.prompt().toLowerCase();
      if (['yes', 'y', 'no', 'n'].includes(choice)) break;
      console.log('\nSorry, invalid choice.');
    }
    return choice[0] === 'y';
  },

  play(rules) {
    while (true) {
      this.displayWelcomeMessage();

      while (!this.winningScoreReached()) {
        this.human.choose(this.rules.moves);
        this.computer.choose(this.rules.moves);
        let winner = this.calculateWinner();
        this.updateScore(winner);
        this.updateHistory(winner);
        this.displayChosenMoves();
        this.displayWinner(winner);
        this.displayScore();
        this.computer.updateWinningMoves(winner);
        this.history.display();
      }

      this.displayGameWinner();
      if (!this.playAgain()) break;
      this.resetScores();
    }

    this.displayGoodbyeMessage();
  }
};

RPSGame.play();
