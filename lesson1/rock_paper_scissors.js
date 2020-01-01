const READLINE = require('readline-sync');

function createPlayer() {
  return {
    move: null,
    score: 0,
    choices: ['rock', 'paper', 'scissors'],

    resetScore() {
      this.score = 0;
    }
  };
}

function createComputer() {
  let computerObject = createPlayer();
  computerObject.choose = function() {
    let randomIndex = Math.floor(Math.random() * this.choices.length);
    this.move = this.choices[randomIndex];
  };

  return computerObject;
}

function createHuman() {
  let humanObject = createPlayer();
  humanObject.choose = function() {
    let choice;
    while (true) {
      console.log('Please choose rock, paper, or scissors:');
      choice = READLINE.prompt().toLowerCase();
      if (this.choices.includes(choice)) break;
      console.log('\nSorry, invalid choice.');
    }
    this.move = choice;
  };

  return humanObject;
}

let RPSGame = {
  winningScore: 2,
  human: createHuman(),
  computer: createComputer(),

  displayWelcomeMessage() {
    console.clear();
    console.log('Welcome to Rock Paper Scissors!');
    console.log(`First to score ${this.winningScore} wins the game\n`);
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

    if ((humanMove === 'rock' && computerMove === 'scissors') ||
        (humanMove === 'scissors' && computerMove === 'paper') ||
        (humanMove === 'paper' && computerMove === 'rock')) {
      return 'human';
    } else if ((humanMove === 'rock' && computerMove === 'paper') ||
               (humanMove === 'paper' && computerMove === 'scissors') ||
               (humanMove === 'scissors' && computerMove === 'rock')) {
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
    console.log(`\nYour score is ${this.human.score}`);
    console.log(`Computer score is ${this.computer.score}`);
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
        this.human.choose();
        this.computer.choose();
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
