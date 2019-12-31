const READLINE = require('readline-sync');

function createPlayer() {
  return {
    move: null
  };
}

function createComputer() {
  let playerObject = createPlayer();

  let computerObject = {
    move: null,

    choose() {
      const CHOICES = ['rock', 'paper', 'scissors'];
      let randomIndex = Math.floor(Math.random() * CHOICES.length);
      this.move = CHOICES[randomIndex];
    }
  };

  return Object.assign(playerObject, computerObject);
}

function createHuman() {
  let playerObject = createPlayer();

  let humanObject =  {
    move: null,

    choose() {
      const CHOICES = ['rock', 'paper', 'scissors'];
      let choice;
        while (true) {
          console.log('Please choose rock, paper, or scissors:');
          choice = READLINE.prompt().toLowerCase();
          if (CHOICES.includes(choice)) break;
          console.log('\nSorry, invalid choice.');
        }
        this.move = choice;
    }
  };

  return Object.assign(playerObject, humanObject);
}

let RPSGame = {
  human: createHuman(),
  computer: createComputer(),

  displayWelcomeMessage() {
    console.log('Welcome to Rock Paper Scissors!');
  },

  displayGoodbyeMessage() {
    console.log('Thanks for playing. Goodbye!');
  },

  displayWinner() {
    console.log(`You chose: ${this.human.move}`);
    console.log(`The computer chose: ${this.computer.move}`);

    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    if ((humanMove === 'rock' && computerMove === 'scissors') ||
        (humanMove === 'paper' && computerMove === 'rock') ||
        (humanMove === 'scissors' && computerMove === 'paper')) {
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
