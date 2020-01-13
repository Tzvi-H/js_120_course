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

class Hand {
  constructor() {
    this.cards = [];
  }

  add(card) {
    this.cards.push(card);
  }

  isBusted() {
    return this.score() > 21
  }

  score() {
    let score = this.cards.reduce((sum, card) => {
      return sum + card.value();
    }, 0)
    score = this.adjustForAces(score, this.cards);
    return score;
  }

  adjustForAces(score, cards) {
    let aces = this.aceCount(cards);
    while (score > 21 && aces > 0) {
      score -= 10;
      aces -= 1;
    }
    return score;
  }

  aceCount(cards) {
    return cards.filter(card => card.rank === 'Ace').length;
  }
}

class Participant {
  constructor() {
    this.hand = new Hand();
  }

  hit(deck) {
    let card = deck.deal();
    this.hand.add(card);
  }

  reveal() {
    this.hand.cards.forEach(card => {
      console.log(card.toString());
    });
    console.log(`Score: ${this.hand.score()}`)
  }
}

class Player extends Participant {
  constructor() {
    super();
  }
}

class Dealer extends Participant {
  constructor() {
    super();
  }

  hide() {
    console.log(this.hand.cards[0].toString());
    console.log('Score: ?');
  }
}