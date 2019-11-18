const express = require('express');
const mongodb = require('mongodb');
const CardDeck = require('../../game/js/CardDeck');

const router = express.Router();

let isProduction = false
if (process.env.PWD.split('/')[2] == 'jcrowle8' || process.env.NODE_ENV === 'production') {
    isProduction = true;
}

// Get game params
router.get('/', async function(req, res) {
    try{
        const cards = await loadCardsCollection();

        let gameid = req.query.gameid
        let player = req.query.player

        if(gameid !== undefined && player !== undefined) {
            let theCards = await cards.findOne({"gameid" : gameid});
            if(Object.keys(theCards.hands).length == 1 && !Object.keys(theCards.hands).includes(player)) {
                let newPlayerHand = await CardDeck.newPlayerJoined(gameid, player)
                res.send(newPlayerHand);
            } else if(Object.keys(theCards.hands).includes(player)) {
                res.send(theCards.hands[player]);
            } else {
                throw Error("Invalid parameters provided to retrieve cards.")
            }     
        } else {
            throw Error("Player or gameid were undefined")
        }
    } catch(err) {
        console.log(err);
        res.status(404).send("Something went wrong retrieving your cards")
    }
});

async function loadCardsCollection() {
    const client = await mongodb.MongoClient.connect
    ('mongodb://localhost:27017', {
        useNewUrlParser: true
    });

    if(isProduction) {
        return client.db('cosc560_jcrowle8').collection('cards')
    }

    return client.db('sequencedb').collection('cards')
}

module.exports = router;