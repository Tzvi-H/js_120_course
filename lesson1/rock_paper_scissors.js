const READLINE = require('readline-sync');

function createPlayer() {
  return {
    move: null,
    score: 0,
    history: [],

    resetScore() {
      this.score = 0;
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
    this.history.push(this.move);
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
    this.history.push(this.move);
  };

  return humanObject;
}

let RPSGame = {
  winningScore: 3,
  winningCombos: {
    rock:     ['lizard', 'scissors'],
    paper:    ['rock', 'spock'],
    scissors: ['paper', 'lizard'],
    spock:    ['scissors', 'rock'],
    lizard:   ['spock', 'paper']
  },
  rules: "Scissors cuts paper, paper covers rock, rock crushes lizard, lizard poisons Spock, Spock smashes scissors, scissors decapitates lizard, lizard eats paper, paper disproves Spock, Spock vaporizes rock, and as it always has, rock crushes scissors.",
  human: createHuman(),
  computer: createComputer(),

  getMoves() {
    return Object.keys(this.winningCombos);
  },

  formatMoves() {
    return this.getMoves()
               .map(move => move[0].toUpperCase() + move.slice(1))
               .join(' ');
  },

  displayWelcomeMessage() {
    console.clear();
    console.log(`Welcome to ${this.formatMoves()}!`);
    console.log(this.rules);
    console.log(`\nFirst to score ${this.winningScore} wins the game`);
  },

  displayGoodbyeMessage() {
    console.log('\nThanks for playing. Goodbye!');
  },

  displayHistory() {
    console.log('User/Computer (HISTORY)');
    this.human.history.forEach((move, index) => {
      console.log(`${move}/${this.computer.history[index]}`);
    });
  },

  winningScoreReached() {
    return (this.human.score === this.winningScore) ||
           (this.computer.score === this.winningScore);
  },

  resetScores() {
    this.human.resetScore();
    this.computer.resetScore();
  },

  calculateWinner() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    if (this.winningCombos[humanMove].includes(computerMove)) {
      return 'human';
    } else if (this.winningCombos[computerMove].includes(humanMove)) {
      return 'computer';
    } else {
      return 'tie';
    }
  },

  updateScore(winner) {
    if (winner !== 'tie') this[winner].score += 1;
  },

  displayChoices() {
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

  play() {
    while (true) {
      this.displayWelcomeMessage();

      while (!this.winningScoreReached()) {
        this.human.choose(this.getMoves());
        this.computer.choose(this.getMoves());
        this.displayChoices();
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

RPSGame.play();
