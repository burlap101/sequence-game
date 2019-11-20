const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

let isProduction = false
if (process.env.PWD.split('/')[2] == 'jcrowle8' || process.env.NODE_ENV === 'production') {
    isProduction = true;
}

// Get messages

router.get('/', async function(req, res) {
  try {
    const messages = await loadChatMessagesCollection();
    let theMessages = await messages.find({ "gameid": req.query.gameid }).toArray();

    res.send(theMessages);

  } catch(err) {
    console.log(err.message);
    reject(err);
  }
    
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
    if(isProduction) {
      const client = await mongodb.MongoClient.connect
      (serverSettings.production.mongo.url, {
        useNewUrlParser: true
      });
      return client.db(serverSettings.production.mongo.name).collection('chatmessages')
    } else {
      const client = await mongodb.MongoClient.connect
      (serverSettings.dev.mongo.url, {
        useNewUrlParser: true
      });
      return client.db(serverSettings.dev.mongo.name).collection('chatmessages')
    }
}

module.exports = router;