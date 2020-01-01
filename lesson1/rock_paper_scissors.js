const READLINE = require('readline-sync');

function createPlayer() {
  return {
    move: null,
    score: 0,

    resetScore() {
      this.score = 0;
    }
  };
}

function createComputer() {
  let computerObject = createPlayer();
  computerObject.choose = function(moves) {
    let randomIndex = Math.floor(Math.random() * moves.length);
    this.move = moves[randomIndex];
  };

  return computerObject;
}

function createHuman() {
  let humanObject = createPlayer();
  humanObject.choose = function(moves) {
    let choice;
    while (true) {
      console.log(`Please choose a move \n${moves.join(', ')}`);
      choice = READLINE.prompt().toLowerCase();
      if (moves.includes(choice)) break;
      console.log('\nSorry, invalid choice.');
    }
    this.move = choice;
  };

  return humanObject;
}

let RPSGame = {
  winningScore: 2,
  winningCombos: {
    rock: ['lizard', 'scissors'],
    paper: ['rock', 'spock'],
    scissors: ['paper', 'lizard'],
    spock: ['scissors', 'rock'],
    lizard: ['spock', 'paper']
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
    console.log(`\nFirst to score ${this.winningScore} wins the game\n`);
  },

  displayGoodbyeMessage() {
    console.log('\nThanks for playing. Goodbye!');
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

    console.log(`\nYou chose: ${humanMove}`);
    console.log(`The computer chose: ${computerMove}`);

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
      this.resetScores();

      while (!this.winningScoreReached()) {
        this.human.choose(this.getMoves());
        this.computer.choose(this.getMoves());
        let winner = this.calculateWinner();
        this.updateScore(winner);
        this.displayWinner(winner);
        this.displayScore();
      }

      if (!this.playAgain()) break;
    }

    this.displayGoodbyeMessage();
  }
};

RPSGame.play();
