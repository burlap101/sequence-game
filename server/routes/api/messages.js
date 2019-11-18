const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

let isProduction = false
if (process.env.PWD.split('/')[2] == 'jcrowle8' || process.env.NODE_ENV === 'production') {
    isProduction = true;
}

// Get messages

router.get('/', async function(req, res) {
    const messages = await loadChatMessagesCollection();
    res.send(await messages.find({"gameid" : req.query.gameid}).toArray());
});

// Add message

router.post('/', async function(req, res) {
    const messages = await loadChatMessagesCollection();
    await messages.insertOne({
        from: req.body.from,
        text: req.body.text,
        gameid: req.body.gameid,
        when: new Date()
    });
    res.status(201).send();
})

async function loadChatMessagesCollection() {
    const client = await mongodb.MongoClient.connect
    ('mongodb://localhost:27017', {
        useNewUrlParser: true
    });

    if(isProduction) {
        return client.db('cosc560_jcrowle8').collection('chatMessages')
    }

    return client.db('sequencedb').collection('chatMessages')
}

module.exports = router;