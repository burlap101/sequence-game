const express = require('express');
const mongodb = require('mongodb');
const CardDeck = require('../../game/js/CardDeck');

const router = express.Router();

let isProduction = false
if(process.env.PWD.split('/')[2]=='jcrowle8') {
    isProduction = true;
}

// Get game params
router.get('/', async function(req, res) {
    try{
        const cards = await loadCardsCollection();

        let gameid = req.query.gameid
        let player = req.query.player

        // console.log("player="+player+" gameid="+gameid);

        if(gameid !== undefined && player !== undefined) {
            let theCards = await cards.findOne({"gameid" : gameid});
            if(Object.keys(theCards.hands).length == 1 && !Object.keys(theCards.hands).includes(player)) {
                console.log("Attempting to add " + player + " to the players list of the cards document")
                let newPlayerHand = await CardDeck.newPlayerJoined(gameid, player)
                console.log(player + "'s cards : " + newPlayerHand);
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