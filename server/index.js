String.prototype.mytrim = function () {
  let s = this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  s = s.replace('\n', '');
  return s;
};

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongodb = require('mongodb');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const CardDeck = require('./game/js/CardDeck');
const GameBoard = require('./game/js/GameBoard');

// handle production
let isProduction = false
if(process.env.PWD.split('/')[2] === 'jcrowle8') {
    isProduction = true;
}

// if(!isProduction) {
//     app.options('*', cors())
// }

// Middleware
app.use(bodyParser.json());
app.use(cors());

const messages = require('./routes/api/messages');
const game = require('./routes/api/game');
const cards = require('./routes/api/cards');

app.use('/api/messages', messages);
app.use('/api/game', game);
app.use('/api/cards', cards);

let port = process.env.PORT || 50135;

const networkDev = true;

app.use(express.static(__dirname + '/public/'));

app.get('/stats', (req, res) => {
    res.sendFile(__dirname + '/public/stats/stats.html');
})

if(isProduction || networkDev) {
    console.log("Production mode");
    // Static folder

    app.get('/game', (req, res) => {
        res.sendFile(__dirname + '/public/game/index.html');
    })
    // send game
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

var socketConns = 0;

io.on('connection', async function (socket) {
    
    socketConns += 1;

    socket.on('disconnect', function() {
        socketConns -= 1;
    })

    sendStatus = function(s) {
        socket.emit('status', s);
    }

    const chatMessages = await loadChatMessagesCollection();
    const games = await loadGamesCollection();


    socket.on('join_room', async function(data) {
        let theGame = await games.findOne({"gameid" : data.gameid})
        socket.join(data.gameid);
        socket.broadcast.to(data.gameid).emit('player_joined', {name: data.username});
    })

    socket.on('card_played', async function(data) {
        let newHand = await CardDeck.cardPlayed(data.gameid, data.player, data.cardName);
        socket.emit('new_hand', newHand);
    })

    socket.on('take_turn', async function(data) {
        let updatedGame = await GameBoard.takeTurn(data.gameid, data.position, data.s)
        io.in(data.gameid).emit('game_update', updatedGame);
    })

    socket.on('new_chat_message', async function(data) {
        let who = data.who;
        let text = data.text; 
        let gameid = data.gameid;
        let when = new Date();

        if(who == ''|| text == '') {
            // send error status
            sendStatus('Please enter a message');
        } else if(text.startsWith('!')) {
          try {
            let cmd = text.slice(1).split(' ');
            if(cmd[0] == 'username') {
              if (cmd.length < 2) {
                sendStatus('Usage: !username <new_name>');
                return;
              }
              let game = await games.findOne({ "gameid": gameid });

              for (let plyr of game.players) {
                if (plyr.name == who) {
                  plyr.name = cmd[1].mytrim();
                }
              }

              await games.findOneAndReplace({ "gameid": gameid }, game);

              sendStatus('Username updated succesfully');
              socket.broadcast.to(data.gameid).emit(
                "new_chat_message", {
                "who": "Gamebot",
                "text": data.who + " changed their username to " + cmd[1]
                }
              )
            } else if (cmd[0].mytrim() == "forfeit") {
              let game = await games.findOne({ "gameid": gameid });
              
              game.finished = new Date();
              game.winnerFound = true;
              for(let plyr of game.players) {
                if(who != plyr.name) {
                  game.theWinner = plyr;
                }
              }

              CardDeck.burnCardsDoc(gameid);

              await games.findOneAndReplace({ "gameid": gameid }, game);

              sendStatus('Game forfeited successfully (or unsucessfully depends if you wanted to win.... Hint: now you can\'t)');
              socket.broadcast.to(data.gameid).emit(
                "new_chat_message", {
                  "who": "Gamebot",
                  "text": data.who + " forfeited the game. You win by default (the two greatest words in the English language 'de' 'fault')"
                }
              )
              io.in(data.gameid).emit('game_update', game);

            } else {
              sendStatus("Invalid command");
            }

          } catch(err) {
              console.log(err);
              sendStatus("There was a problem processing this command");
          }

        } else {
            // insert message into collection
            chatMessages.insertOne({
                who: who,
                text: text,
                when: when
            })
            socket.broadcast.to(data.gameid).emit("new_chat_message", data)
        }
        
    })
})

server.listen(port, function() { 
    console.log(`Server started on port ${port}`);
});

async function loadChatMessagesCollection() {
    const client = await mongodb.MongoClient.connect
    ('mongodb://localhost:27017', {
        useNewUrlParser: true
    });

    if(isProduction) {
        return client.db('cosc560_jcrowle8').collection('chatMessages');
    }

    return client.db('sequencedb').collection('chatMessages');
}


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





