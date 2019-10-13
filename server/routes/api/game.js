const express = require('express');
const mongodb = require('mongodb');
const GameBoard = require('../../game/js/GameBoard');
const CardDeck = require('../../game/js/CardDeck');
const cors = require('cors');

const router = express.Router();

let isProduction = false
if(process.env.PWD.split('/')[2]=='jcrowle8') {
    isProduction = true;
}

// Get game params
router.get('/', async function(req, res) {
    try{
        const games = await loadGamesCollection();

        let gameid = req.query.gameid
        let username = req.query.username

        if(gameid === 'all') {
            res.send(await games.find({}).toArray());
        } else if (gameid !== undefined && username !== undefined) {
            let theGame = await games.findOne({ "gameid": gameid });
            let playerNames = []
            for (let player of theGame.players) {
                playerNames.push(player.name)
            }
            if (theGame.players.length == 1 && theGame.players[0].name != username) {
                if(theGame.playerTurn !== theGame.players[0].name) {
                    theGame.playerTurn = username;
                }
                theGame.players.push({
                    name: username,
                    s: "a",
                    sequences: 0
                });
                
                games.findOneAndReplace({"gameid": gameid}, theGame);
                res.send(theGame);
            } else if (playerNames.includes(username)) {
                res.send(theGame);
            } else {
                throw Error("Invalid parameters provided");
            }
        } else {
            throw Error("Bad request")
        }

    } catch(err) {
        console.log(err);
        res.status(404).send("Game not available")
    }

    // if (id !== undefined && theGame !== []) {
    //     res.send(theGame);
    // } else {
    //     // create a game
    // }
});

router.post('/', async function(req, res) {
    try {
        let uname = req.body.username;
        if(uname !== undefined && uname !== "") {
            let newGame = GameBoard.createGame(uname);
            CardDeck.initCards(newGame.gameid, uname); // initialising the cards only api requests handled elsewhere to avoid cheating
            const games = await loadGamesCollection();
            await games.insertOne(newGame);
            res.status(201).send({ "gameid": newGame.gameid });
        } else {
            throw Error("Improper username provided with request");
        }
    } catch(err) {
        console.log(err);
        res.status(404).send(err);
    }
    
});

async function loadGamesCollection() {
    const client = await mongodb.MongoClient.connect
    ('mongodb://localhost:27017', {
        useNewUrlParser: true
    });

    if(isProduction) {
        return client.db('cosc560_jcrowle8').collection('games')
    }

    return client.db('sequencedb').collection('games')
}

module.exports = router;