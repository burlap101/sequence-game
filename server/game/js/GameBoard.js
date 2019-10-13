const mongodb = require('mongodb');
const jsonBoard = require('../json/board_orientation.json');

const chars = "abcdefghijklmnopqrstuvwxyz0123456789"

let isProduction = false
if(process.env.PWD.split('/')[2] === 'jcrowle8') {
    isProduction = true;
}
class GameBoard {

  static createBoard() {
    let board = [];
    for (let i = 0; i < 10; i++) {
      let row = [];
      for (let j = 0; j < 10; j++) {
        row.push("u");
      }
      board.push(row);
    }

    return board;
  }
  static randomId() {
    let code = ""
    for (let i = 0; i < 8; i++) {
        let n = Math.floor(Math.random() * chars.length)
        code += chars.charAt(n)
    }
    return code
  }

  static createGame(username) {
    return {
      gameid: this.randomId(),
      playerTurn: username,
      board: this.createBoard(),
      winnerFound: false,
      theWinner: {},
      players: [
        {
          name: username,
          s: "p",
          sequences: 0
        }
      ],
      turnsTaken: 0,
      created: new Date(),
    }
  }
  /* takeTurn returns true if winner found else false */
  /* TODO: Change sequences back to ==2 not ==1 to return true */
  static async takeTurn(gameid, position, s) {
    try {
      let mongoClient = await this.loadGamesCollection();
      let gameObj = await mongoClient.findOne({"gameid" : gameid});

      gameObj.board[position.row][position.col] = s;
      let i = 0
      console.log("The passed in s = " + s);
      console.log("Here come the players...");
      for(i =0; i<gameObj.players.length; i++) {
        if(gameObj.players[i].s == s) {
          break;
        }
      }
      gameObj.players[i].sequences += this.checkForSequence(s, position, gameObj)
      //TODO: Change back to sequences >= 2
      if (gameObj.players[i].sequences >= 2) {
        gameObj.winnerFound = true;
        gameObj.theWinner = gameObj.players[i];
        gameObj.finished = new Date();
      }

      if(gameObj.players.length == 1) {
        gameObj.playerTurn = "!Absent"
      } else {
        for(let p of gameObj.players) {
          if(p.s !== s) {
            gameObj.playerTurn = p.name;
          }
        }
      }
      await mongoClient.findOneAndReplace({"gameid": gameid}, gameObj);
      return gameObj;

    } catch(err) {
      console.log(err);
    }
  }

  static checkForSequence(s, position, gameObj) {
    Array.prototype.spliceArray = function(index, n, array) {
      return Array.prototype.splice.apply(this, [index, n].concat(array));
    }
    // let mongoClient = await this.loadGamesCollection();
    // let gameObj = mongoClient.findOne({"gameid" : gameid});

    // console.log(s);
    // initiate the wilds as the corresponding spot
    gameObj.board[0][0] = s.toUpperCase();
    gameObj.board[0][9] = s.toUpperCase();
    gameObj.board[9][0] = s.toUpperCase();
    gameObj.board[9][9] = s.toUpperCase();

    let seq = 0;
    let row = gameObj.board[position.row].join("");
    let index = row.toUpperCase().indexOf(s.repeat(5).toUpperCase());

    /* Performing a check on the row first */
    if (index >= 0 && row.slice(index, index + 5).includes(s)) {
      let newArray = [];
      for (let i = 0; i < 5; i++) {
        newArray.push(s.toUpperCase());
      }
      gameObj.board[position.row].spliceArray(index, 5, newArray);
      seq += 1;
    } else if (
      index == 0 &&
      (row.slice(5, 10) == s.repeat(5) ||
        row.slice(5, 10) == s.repeat(4) + s.toUpperCase())
    ) {
      let newArray = [];
      for (let i = 0; i < 5; i++) {
        newArray.push(s.toUpperCase());
      }
      gameObj.board[position.row].spliceArray(index, 5, newArray);
      seq += 1;
    }
    console.log("checkForSequence: Row = " + gameObj.board[position.row].join(""));

    /* now the column */
    let col = [];
    let newCol = col;
    for (let row of gameObj.board) {
      col.push(row[position.col]);
    }
    col = col.join("");

    index = col.toUpperCase().indexOf(s.repeat(5).toUpperCase());

    if (index >= 0 && col.slice(index, index + 5).includes(s)) {
      for (let i = index; i < index + 5; i++) {
        gameObj.board[i][position.col] = s.toUpperCase();
        newCol[i] = gameObj.board[i][position.col];
      }
      seq += 1;
    } else if (
      index == 0 &&
      (col.slice(5, 10) == s.repeat(5) ||
        col.slice(5, 10) == s.repeat(4) + s.toUpperCase())
    ) {
      for (let i = 5; i < 10; i++) {
        gameObj.board[i][position.col] = s.toUpperCase;
        newCol[i] = gameObj.board[i][position.col];
      }
      seq += 1;
    }
    console.log("checkForSquence: Col = " + col);
    let diag = [];
    row = position.row;
    col = position.col;
    while (row > 0 && col > 0) {
      row--;
      col--;
    }
    while (row < 10 && col < 10) {
      diag.push(gameObj.board[row][col]);
      row++;
      col++;
    }

    let newDiag = diag;
    diag = diag.join("");
    index = diag.toUpperCase().indexOf(s.repeat(5).toUpperCase());
    if (index >= 0 && diag.slice(index, index + 5).includes(s)) {
      while (row > 0 && col > 0) {
        row--;
        col--;
      }
      row += index;
      col += index;
      for (let i = 0; i < 5; i++) {
        gameObj.board[row][col] = s.toUpperCase();
        newDiag[index + i] = gameObj.board[row][col];
        row++;
        col++;
      }
      seq += 1;
    } else if (index == 0 && diag.length == 10) {
      if (diag.slice(5, 10) == s.repeat(4) + s.toUpperCase()) {
        row = 5;
        col = 5;
        for (let i = 5; i < 10; i++) {
          gameObj.board[row][col] = s.toUpperCase();
          newDiag[i] = gameObj.board[row][col];
          row++;
          col++;
        }
        seq += 1;
      }
    }
    console.log("checkForSequence: Diag1 = " + newDiag.join(""));

    diag = [];
    row = position.row;
    col = position.col;

    while (row > 0 && col < 10) {
      row--;
      col++;
    }
    while (row < 10 && col > 0) {
      diag.push(gameObj.board[row][col]);
      row++;
      col--;
    }

    newDiag = diag;
    diag = diag.join("");
    index = diag.toUpperCase().indexOf(s.repeat(5).toUpperCase());
    if (index >= 0 && diag.slice(index, index + 5).includes(s)) {
      while (row > 0 && col < 10) {
        row--;
        col++;
      }
      row += index;
      col -= index;
      for (let i = 0; i < 5; i++) {
        gameObj.board[row][col] = s.toUpperCase();
        newDiag[index + i] = gameObj.board[row][col];
        row++;
        col--;
      }
      seq += 1;
    } else if (index == 0 && diag.length == 10) {
      if (diag.slice(5, 10) == s.repeat(4) + s.toUpperCase()) {
        row = 5;
        col = 5;
        for (let i = 5; i < 10; i++) {
          gameObj.board[row][col] = s.toUpperCase();
          newDiag[i] = gameObj.board[row][col];
          row++;
          col++;
        }
        seq += 1;
      }
    }
    console.log("checkForSequence: Diag2 = " + newDiag.join(""));

    // set the wilds back normal
    gameObj.board[0][0] = 'u';
    gameObj.board[0][9] = 'u';
    gameObj.board[9][0] = 'u';
    gameObj.board[9][9] = 'u';

    return seq
  }

  static boardObject() {
    let boardObject = {
      rows: []
    };
  
    for (let row of jsonBoard.jsonBoard.rows) {
      boardObject.rows.push(
        row.map(function(card) {
          return { name: card, isOccupied: false };
        })
      );
    }
    return boardObject;
  }

  static async closeGame(gameid) {
    let mongoClient = await this.loadGamesCollection();
    let gameCount = mongoClient.find({"gameid": gameid});
    mongoClient.deleteMany({"gameid": gameid});

    console.log("Deleted " + gameCount + " GameBoard documents from DB");
    return gameCount 
  }

  static async loadGamesCollection() {
    const client = await mongodb.MongoClient.connect
    ('mongodb://localhost:27017', {
        useNewUrlParser: true
    });

    if(isProduction) {
        return client.db('cosc560_jcrowle8').collection('games')
    }

    return client.db('sequencedb').collection('games')
  }
}

module.exports = GameBoard;