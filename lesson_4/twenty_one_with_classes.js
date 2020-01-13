class Card {
  constructor(rank, suit) {
    this.rank = rank;
    this.suit = suit;
  }

  value() {
    switch (this.rank) {
      case 'Ace':
        return 11;
        break;
      case 'Jack':
      case 'Queen':
      case 'King':
        return 10;
        break;
      default:
        return this.rank;  
    }
  }

  toString() {
    return `${this.rank} of ${this.suit}`;
  }
}

class Deck {
  constructor() {
    this.deck = this.initDeck();
    this.shuffle(this.deck);
  }

  initDeck() {
    const SUITS = ['Diamonds', 'Hearts', 'Clubs', 'Spades'];
    const RANKS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King', 'Ace'];
    let deck = [];
    SUITS.forEach(suit => {
      RANKS.forEach(rank => {
        deck.push(new Card(rank, suit))
      })
    })
    return deck;
  }

  shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i -= 1) {
      let j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

  deal() {
    return this.deck.pop();
  }
}

class Participant {
  constructor() {
    //STUB
    // What sort of state does a participant need?
    // Score? Hand? Amount of money available?
    // What else goes here? all the redundant behaviors from Player and Dealer?
  }
}

class Player extends Participant {
  constructor() {
    //STUB
    // What sort of state does a player need?
    // Score? Hand? Amount of money available?
  }

  hit() {
    //STUB
  }

  stay() {
    //STUB
  }

  isBusted() {
    //STUB
  }

  score() {
    //STUB
  }
}

class Dealer extends Participant {
  // Very similar to a Player; do we need this?

  constructor() {
    //STUB
    // What sort of state does a dealer need?
    // Score? Hand? Deck of cards? Bow tie?
  }

  hit() {
    //STUB
  }

  stay() {
    //STUB
  }

  isBusted() {
    //STUB
  }

  score() {
    //STUB
  }

  hide() {
    //STUB
  }

  reveal() {
    //STUB
  }

  deal() {
    //STUB
    // does the dealer or the deck deal?
  }
}

class TwentyOneGame {
  constructor() {
    //Stub
    // State? deck? two participants?
  }

  start() {
    //Spike
    this.displayWelcomeMessage();
    this.dealCards();
    this.showCards();
    this.playerTurn();
    this.dealerTurn();
    this.displayResult();
    this.displayGoodbyeMessage();
  }

  dealCards() {
    //STUB
  }

  showCards() {
    //STUB
  }

  playerTurn() {
    //STUB
  }

  dealerTurn() {
    //STUB
  }

  displayWelcomeMessage() {
    //STUB
  }

  displayGoodbyeMessage() {
    
  }

  displayResult() {
    //STUB
  }
}

let game = new TwentyOneGame();
game.start();