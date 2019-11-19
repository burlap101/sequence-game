const mongodb = require('mongodb');
const serverSettings = require('../../settings.json');

const suites = {
  h: "hearts",
  d: "diamonds",
  c: "clubs",
  s: "spades"
};
const faces = {
  a: "ace",
  k: "king",
  q: "queen",
  j: "jack"
};

// handle production
let isProduction = false
if (process.env.PWD.split('/')[2] === 'jcrowle8' || process.env.NODE_ENV === 'production') {
    isProduction = true;
}

class CardDeck {

  static async initCards(gameid, username) {
    try {
      let obj = this.createCardDeckObject(gameid);
      obj.hands = {};
      obj.hands[username] = this.dealCards(7, obj);

      let mongoClient = await this.loadCardsCollection();

      await mongoClient.insertOne(obj);
    } catch(err) {
      console.log(err);
      throw Error("There was a problem dealing cards to the first player")
    }
  }

  static async newPlayerJoined(gameid, username) {
    try {
      let mongoClient = await this.loadCardsCollection();
      let cd = await mongoClient.findOne({"gameid": gameid});

      cd.hands[username] = this.dealCards(7, cd);

      await mongoClient.findOneAndReplace({"gameid" : gameid}, cd);
      return cd.hands[username];
    } catch(err) {
      console.log(err);
      throw Error("There was a problem dealing cards to the new player")
    }
  }

  static createCardDeckObject(gameid) {
    let obj = {};
    obj.gameid = gameid;
    obj.discardPile = this.createDeck(true);
    obj.deck = this.createDeck(false);
    obj.shuffled = this.shuffleDeck();

    return obj;
  }

  static async loadCardsCollection() {
    try {
      if (isProduction) {
        const client = await mongodb.MongoClient.connect
        (serverSettings.production.mongo.url, {
          useNewUrlParser: true
        });
        return client.db(serverSettings.production.mongo.name).collection('cards')
      } else {
        const client = await mongodb.MongoClient.connect
        (serverSettings.dev.mongo.url, {
          useNewUrlParser: true
        });
        return client.db(serverSettings.dev.mongo.name).collection('cards')
      }

    } catch(err) {
      console.log(err);
      throw Error("There was a problem accessing the card collection")
    }
  }

  static createDeck(discard) {
    let cards = {};
    let numCards = 2;
    if (discard == true) {
      numCards = 0;
    }
    for (let suite of Object.keys(suites)) {
      for (let i = 2; i <= 10; i++) {
        cards[i + suite] = numCards;
      }
      for (let face of Object.keys(faces)) {
        cards[face + suite] = numCards;
      }
    }
    return cards;
  }

  static shuffleDeck() {
    let deck = this.createDeck(false)
    let shuffled = Object.keys(deck);
    shuffled = shuffled.concat(Object.keys(deck));
    for (let i = shuffled.length - 1; i > 0; i--) {
      let index = Math.floor((i + 1) * Math.random());
      let temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    return shuffled;
  }

  static dealCards(ncards, deckobj) {
    let min = deckobj.shuffled.length - ncards;
    let cards = deckobj.shuffled.slice(min);
    for (let card of cards) {
      deckobj.deck[card]--;
      deckobj.discardPile[card]++;
      if (deckobj.deck[card] == 0) {
        delete deckobj.deck[card];
      }
    }
    deckobj.shuffled.splice(min, ncards);
    return cards;
  }

  static async playerNameChange(gameid, oldName, newName) {
    try {
      let mongoClient = await this.loadCardsCollection();
      let obj = await mongoClient.findOne({ "gameid" : gameid });
      let hand = obj.hands[oldName];

      obj.hands[newName] = obj.hands[oldName];

      delete obj.hands[oldName];

      await mongoClient.findOneAndReplace({"gameid": gameid}, obj);

    } catch(err) {
      console.log(err);
      throw Error("There was a problem assigning the hand to the new username.");
    }
  }

  static async cardPlayed(gameid, player, cardName) {
    try {
      let mongoClient = await this.loadCardsCollection();
      let obj = await mongoClient.findOne({"gameid": gameid});

      let index = obj.hands[player].indexOf(cardName);
      let newCard = this.dealCards(1, obj)[0];
      obj.hands[player].splice(index, 1, newCard);
      await mongoClient.findOneAndReplace({"gameid": gameid}, obj);
      return obj.hands[player];
    } catch(err) {
      console.log(err);
      throw Error("There was a problem playing a card, card: " + cardName + " by: " + player);
    }
  }

  static async burnCardsDoc(gameid) {
    let mongoClient = await this.loadCardsCollection();
    let deckCount = mongoClient.find({"gameid": gameid}).toArray().length;

    mongoClient.deleteMany({"gameid": gameid});

    return deckCount 
  }
}

module.exports = CardDeck;