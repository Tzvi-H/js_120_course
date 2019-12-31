const READLINE = require('readline-sync');

function createPlayer(playerType) {
  return {
    name: null,
    move: null,
    playerType,

    choose() {
      if (this.isHuman()) {

      } else {
        const choices = ['rock', 'paper', 'scissors'];
        let randomIndex = Math.floor(Math.random() * choices.length);
        this.move = choices[randomIndex];
      }
    },

    isHuman() {
      return this.playerType === 'player';
    }
  }
}

function createMove(move) {
  return {
    move
  }
}

function compare(move1, move2) {

}

let RPSGame = {
  human: createPlayer('human'),
  computer: createPlayer('computer'),

  displayWelcomeMessage() {
    console.log('Welcome to Rock Paper Scissors!');
  },
  
  displayGoodbyeMessage() {
    console.log('Thanks for playing. Goodbye!');
  },

  play() {
    this.displayWelcomeMessage();
    this.human.choose();
    this.computer.choose();
    //displayWinner();
    this.displayGoodbyeMessage();
  }
}

RPSGame.play();
