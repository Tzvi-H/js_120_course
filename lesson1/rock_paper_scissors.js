const READLINE = require('readline-sync');

function createPlayer() {
  return {
    move: null,
    choices: ['rock', 'paper', 'scissors']
  };
}

function createComputer() {
  let computerObject = createPlayer();
  computerObject.choose = function() {
    let randomIndex = Math.floor(Math.random() * this.choices.length);
    this.move = this.choices[randomIndex];
  }

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
  }

  return humanObject;
}

let RPSGame = {
  human: createHuman(),
  computer: createComputer(),

  displayWelcomeMessage() {
    console.log('Welcome to Rock Paper Scissors!');
  },

  displayGoodbyeMessage() {
    console.log('\nThanks for playing. Goodbye!');
  },

  displayWinner() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    console.log(`\nYou chose: ${humanMove}`);
    console.log(`The computer chose: ${computerMove}`);

    if ((humanMove === 'rock' && computerMove === 'scissors') ||
        (humanMove === 'scissors' && computerMove === 'paper') ||
        (humanMove === 'paper' && computerMove === 'rock')) {
      console.log('You win!');
    } else if ((humanMove === 'rock' && computerMove === 'paper') ||
               (humanMove === 'paper' && computerMove === 'scissors') ||
               (humanMove === 'scissors' && computerMove === 'rock')) {
      console.log('Computer wins!');
    } else {
      console.log("It's a tie");
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

  play() {
    this.displayWelcomeMessage();

    while (true) {
      this.human.choose();
      this.computer.choose();
      this.displayWinner();
      if (!this.playAgain()) break;
    }

    this.displayGoodbyeMessage();
  }
};

RPSGame.play();
