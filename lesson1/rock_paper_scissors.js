const READLINE = require('readline-sync');

function createMove(type) {
  return {
    type,

    compare(otherMove, winningCombos) {
      if (winningCombos[this.type].includes(otherMove.type)) {
        return 1;
      } else if (winningCombos[otherMove.type].includes(this.type)) {
        return -1;
      } else {
        return 0;
      }
    }
  };
}

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

  computerObject.updateWinningHistory = function(outcome) {
    if (outcome === 'computer') {
      this.winningHistory.push(this.move.type);
    } else if (outcome === 'human') {
      let index = this.winningHistory.indexOf(this.move.type);
      if (index >= 0) this.winningHistory.splice(index, 1);
    }
  };

  return computerObject;
}

function createHuman() {
  let humanObject = createPlayer();

  humanObject.choose = function(moves) {
    let choice;
    let matchesChoice = (mv => mv === choice || mv.slice(0, 2) === choice);
    while (true) {
      console.log('\nPlease choose a move');
      moves.forEach(move => console.log(`'${move.slice(0, 2)}' for ${move}`));
      choice = READLINE.prompt().toLowerCase();
      choice = moves.find(matchesChoice);
      if (choice) break;
      console.log('\nSorry, invalid choice.');
    }
    this.move = createMove(choice);
  };

  return humanObject;
}

function createRules() {
  return {
    instructions: "scissors cuts paper, paper covers rock, rock crushes lizard, lizard poisons spock, spock smashes scissors, scissors decapitates lizard, lizard eats paper, paper disproves spock, spock vaporizes rock, rock crushes scissors.",
    winningScore: 5,
    gamePieces: ['lizard', 'rock', 'paper', 'scissors', 'spock'],
    winningCombos: {
      rock:     ['lizard', 'scissors'],
      paper:    ['rock', 'spock'],
      scissors: ['paper', 'lizard'],
      spock:    ['scissors', 'rock'],
      lizard:   ['spock', 'paper']
    },

    capitalizedPieces() {
      return this.gamePieces
                 .map(move => move[0].toUpperCase() + move.slice(1))
                 .join(' ');
    },
  };
}

function createHistory() {
  return {
    humanChoices: [],
    computerChoices: [],
    outcomes: [],

    display() {
      console.log('Last 10 rounds');
      this.humanChoices.slice(0, 10).forEach((choice, index) => {
        console.log(`${index + 1}. ${choice}/${this.computerChoices[index]}` +
                    ` => ${this.outcomes[index]}`);
      });
    }
  };
}

let RPSGame = {
  rules: createRules(),
  history: createHistory(),
  human: createHuman(),
  computer: createComputer(),

  displayWelcomeMessage() {
    console.clear();
    console.log(`Welcome to ${this.rules.capitalizedPieces()}!\n`);
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

  calculateRoundOutcome() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;
    let winningCombos = this.rules.winningCombos;
    switch (humanMove.compare(computerMove, winningCombos)) {
      case 1:  return 'human';
      case -1: return 'computer';
      default: return 'tie';
    }
  },

  updateScore(outcome) {
    if (outcome !== 'tie') this[outcome].incrementScore();
  },

  updateHistory(outcome) {
    this.history.humanChoices.unshift(this.human.move.type);
    this.history.computerChoices.unshift(this.computer.move.type);
    this.history.outcomes.unshift(outcome);
  },

  displayChoices() {
    console.clear();
    console.log(`You chose: ${this.human.move.type}`);
    console.log(`Computer chose: ${this.computer.move.type}\n`);
  },

  displayRoundOutcome(outcome) {
    let humanMove = this.human.move.type;
    let computerMove = this.computer.move.type;
    switch (outcome) {
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

  displayGameoutcome() {
    let winningScore = this.rules.winningScore;
    if (this.human.score === winningScore) {
      console.log(`\nYou win the game!`);
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

  playRound() {
    this.human.choose(this.rules.gamePieces);
    this.computer.choose(this.rules.gamePieces);
    let outcome = this.calculateRoundOutcome();
    this.updateScore(outcome);
    this.updateHistory(outcome);
    this.displayChoices();
    this.displayRoundOutcome(outcome);
    this.displayScore();
    this.computer.updateWinningHistory(outcome);
    this.history.display();
    console.log(this.computer.winningHistory);
  },

  play() {
    while (true) {
      this.displayWelcomeMessage();

      while (!this.winningScoreReached()) {
        this.playRound();
      }
      this.displayGameoutcome();

      if (!this.playAgain()) break;
      this.resetScores();
    }

    this.displayGoodbyeMessage();
  }
};

RPSGame.play();
