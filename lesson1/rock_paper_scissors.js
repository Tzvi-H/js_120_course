const READLINE = require('readline-sync');

function createPlayer() {
  return {
    move: null,
    score: 0,
    history: [],

    resetScore() {
      this.score = 0;
    },

    addToHistory(move) {
      this.history.push(move);
      if (this.history.length > 10) this.history.shift();
    }
  };
}

function createComputer() {
  let computerObject = createPlayer();
  computerObject.winningHistory = [];

  computerObject.choose = function(moves) {
    let options = moves.concat(this.winningHistory);
    let randomIndex = Math.floor(Math.random() * options.length);
    this.move = options[randomIndex];
    this.addToHistory(this.move);
  };

  computerObject.updateWinningMoves = function(winner) {
    if (winner === 'computer')  this.winningHistory.push(this.move);
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
    this.move = choice;
    this.addToHistory(this.move);
  };

  return humanObject;
}

function createRules() {
  return {
    instructions: "Scissors cuts paper, paper covers rock, rock crushes lizard, lizard poisons Spock, Spock smashes scissors, scissors decapitates lizard, lizard eats paper, paper disproves Spock, Spock vaporizes rock, and as it always has, rock crushes scissors.",
    winningScore: 5,
    winningCombos: {
      rock:     ['lizard', 'scissors'],
      paper:    ['rock', 'spock'],
      scissors: ['paper', 'lizard'],
      spock:    ['scissors', 'rock'],
      lizard:   ['spock', 'paper']
    }
  }
}

let RPSGame = {
  human: createHuman(),
  computer: createComputer(),
  rules: null,

  getMoves() {
    return Object.keys(this.rules.winningCombos);
  },

  formatMoves() {
    return this.getMoves()
               .map(move => move[0].toUpperCase() + move.slice(1))
               .join(' ');
  },

  displayWelcomeMessage() {
    console.clear();
    console.log(`Welcome to ${this.formatMoves()}!`);
    console.log(this.rules.instructions);
    console.log(`\nFirst to score ${this.rules.winningScore} wins the game`);
  },

  displayGoodbyeMessage() {
    console.log('\nThanks for playing. Goodbye!');
  },

  displayHistory() {
    console.log('User/Computer (HISTORY of last 10 rounds)');
    this.human.history.forEach((move, index) => {
      console.log(`${move}/${this.computer.history[index]}`);
    });
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

    if (this.rules.winningCombos[humanMove].includes(computerMove)) {
      return 'human';
    } else if (this.rules.winningCombos[computerMove].includes(humanMove)) {
      return 'computer';
    } else {
      return 'tie';
    }
  },

  updateScore(winner) {
    if (winner !== 'tie') this[winner].score += 1;
  },

  displayChosenMoves() {
    console.clear();
    console.log(`You chose: ${this.human.move}`);
    console.log(`Computer chose: ${this.computer.move}`);
  },

  displayWinner(winner) {
    switch (winner) {
      case 'human':
        console.log('You win!');
        break;
      case ('computer'):
        console.log('The computer wins!');
        break;
      default:
        console.log("It's a tie!");
    }
  },

  displayScore() {
    console.log(`\nUser score: ${this.human.score}`);
    console.log(`Computer score: ${this.computer.score}`);
    if (this.human.score === this.winningScore) {
      console.log('\nYou win the game. Congrats!');
    } else if (this.computer.score === this.winningScore) {
      console.log('\nComputer wins the game.');
    }
    console.log();
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
    this.rules = rules;

    while (true) {
      this.displayWelcomeMessage();

      while (!this.winningScoreReached()) {
        this.human.choose(this.getMoves());
        this.computer.choose(this.getMoves());
        this.displayChosenMoves();
        let winner = this.calculateWinner();
        this.updateScore(winner);
        this.displayWinner(winner);
        this.displayScore();
        this.displayHistory();
        this.computer.updateWinningMoves(winner);
      }

      if (!this.playAgain()) break;
      this.resetScores();
    }

    this.displayGoodbyeMessage();
  }
};

RPSGame.play(createRules());
