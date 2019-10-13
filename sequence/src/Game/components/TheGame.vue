<template>
  <div>
    <div id="board-div" class="board">
      <svg
        v-bind:viewBox="
          viewBox.xmin +
            ' ' +
            viewBox.ymin +
            ' ' +
            viewBox.width +
            ' ' +
            viewBox.height
        "
        xmlns="http://www.w3.org/2000/svg"
      >
        <g v-bind:key="'row-' + irow" v-for="(row, irow) in jsonBoard">
          <BoardCard
            v-bind:card="card"
            v-bind:imgParams="imgParams(irow, icard)"
            v-bind:chipParams="chipParams(irow, icard)"
            v-for="(card, icard) in row"
            v-bind:key="irow + '-' + icard"
            v-bind:bcid="irow + '-' + icard"
            v-bind:data-card="card"
            v-bind:playerHand="playerHand"
            v-bind:playerTurn="playerTurn"
            v-on:turn-taken="takeTurn"
            v-bind:jacks="jacks"
            v-on:jack-played="takeTurn"
            v-on:show-warning="showWarning"
            v-bind:winnerFound="winnerFound"
          />
        </g>
      </svg>
    </div>
    <h3 class="text-center my-2">Your Hand</h3>

    <div id="players-hand-div" class="text-center players-hand">
      <span
        v-bind:key="icard + card"
        v-for="(card, icard) in playerHand"
        class="players-card"
      >
        <img
          v-bind:src="'/assets/cards_v/' + card + '.svg'"
          height="90"
          width="60"
          v-bind:data-card="card"
          v-on:click="playJack"
        />
      </span>
    </div>
    <div
      v-if="winnerFound"
      class="alert alert-success text-primary"
      role="alert"
    >
      {{ theWinner.name }}'s the winner!!!
    </div>
    <div
      v-else-if="playerTurn"
      id="turn-indicator"
      class="alert alert-success"
      role="alert"
    >
      Your Turn
    </div>

    <div v-else class="alert alert-warning" role="alert">
      {{ opponent.name }}'s turn
    </div>
    <div v-if="warning.isActive" class="alert alert-danger" role="alert">
      {{ warning.text }}
    </div>
    <div
      v-if="jacks.oneEyedSelected || jacks.twoEyedSelected"
      class="alert alert-primary"
      role="alert"
    >
      A Jack is selected. Click any unoccupied position on the board (except the
      corner ones)
    </div>
  </div>
</template>

<script>
import BoardCard from "./BoardCard.vue";
import { CardService } from "../assets/js/CardService";
import { GameService } from "../assets/js/GameService";
import jsonBoard from "../assets/json/board_orientation.json";

const fills = {
  p: "#007BFF",
  a: "#41b882",
  u: "#000000"
};

const boardObj = (function() {
  let boardObject = {
    rows: []
  };

  for (let row of jsonBoard.jsonBoard.rows) {
    boardObject.rows.push(
      row.map(function(card) {
        return { name: card, isOccupied: false, fill: fills["p"] };
      })
    );
  }
  return boardObject;
})();

export default {
  name: "TheGame",
  props: ["socket", "myopponent", "gameid", "username"],
  components: {
    BoardCard
  },
  data() {
    return {
      viewBox: {
        xmin: 0,
        ymin: 0,
        width: 75,
        height: 50
      },
      handBox: {
        width: 850,
        height: 150
      },
      playerTurn: true,
      jacks: {
        twoEyed: ["jd", "jc"],
        oneEyed: ["jh", "js"],
        twoEyedSelected: false,
        oneEyedSelected: false,
        name: ""
      },
      warning: {
        text: "",
        isActive: false
      },
      winnerFound: false,
      theWinner: {},
      playerIdentifier: "",
      players: [],
      playerHand: [],
      opponent: this.myopponent,
      theBoard: [],
      jsonBoard: []
    };
  },

  methods: {
    chipParams: function(irow, icard) {
      return {
        r: this.viewBox.height / 50,
        opacity: 1.0,
        cx: this.viewBox.width / 20 + (icard * this.viewBox.width) / 10,
        cy: this.viewBox.height / 20 + (irow * this.viewBox.height) / 10
      };
    },
    imgParams: function(irow, icard) {
      return {
        height: this.viewBox.height / 11,
        width: this.viewBox.width / 11,
        x: this.viewBox.width / 200 + (icard * this.viewBox.width) / 10,
        y: this.viewBox.height / 200 + (irow * this.viewBox.height) / 10
      };
    },
    takeTurn: async function(cardName, bcid) {
      let position = {
        row: bcid.split("-")[0],
        col: bcid.split("-")[1]
      };
      if (this.playerTurn) {
        if (this.jacks.oneEyedSelected || this.jacks.twoEyedSelected) {
          this.socket.emit("card_played", {
            cardName: this.jacks.name,
            gameid: this.gameid,
            player: this.username
          });
        } else {
          this.socket.emit("card_played", {
            cardName: cardName,
            gameid: this.gameid,
            player: this.username
          });
        }
        this.socket.emit("take_turn", {
          gameid: this.gameid,
          position: position,
          s: this.playerIdentifier
        });
        this.playerTurn = !this.playerTurn;
        this.warning.isActive = false;
        //TODO: create a winner socket event....
      } else {
        this.warning.isActive = true;
        this.warning.text = "It is not your turn";
      }
      this.jacks.twoEyedSelected = false; //TODO: Review this as this jsut a workaround for now.
      this.jacks.oneEyedSelected = false;
      this.warning.isActive = false;
    },
    playJack: function(event) {
      console.log(event.target.dataset.card);
      if (this.jacks.oneEyed.includes(event.target.dataset.card)) {
        console.log("one eyed jack!");
        this.jacks.oneEyedSelected = true;
        this.jacks.name = event.target.dataset.card;
      } else if (this.jacks.twoEyed.includes(event.target.dataset.card)) {
        console.log("two eyed jack!!");
        this.jacks.twoEyedSelected = true;
        this.jacks.name = event.target.dataset.card;
      }
    },
    showWarning: function(text) {
      this.warning.isActive = true;
      this.warning.text = text;
    }
  },
  watch: {
    myopponent: function() {
      this.opponent = this.myopponent;
    }
  },

  async created() {
    // first creating the board object and initiating it
    console.log("Attempting to retrieve game");
    try {
      let jb = boardObj.rows;
      let theGame = await GameService.getGame(this.gameid, this.username);
      console.log(theGame);
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          if (theGame.board[i][j] != "u") {
            jb[i][j].isOccupied = true;
            jb[i][j].fill = fills[theGame.board[i][j].toLowerCase()];
          }
        }
      }
      this.jsonBoard = jb;
      this.playerTurn = theGame.playerTurn === this.username;
      console.log(theGame.playerTurn);
      this.players = theGame.players;
      for (let p of this.players) {
        if (p.name === this.username) {
          this.playerIdentifier = p.s;
        } else {
          this.opponent = p;
        }
      }
    } catch (err) {
      this.error = err.message;
      console.log(err.message);
    }

    console.log("attempting to get player's cards");
    try {
      this.playerHand = await CardService.getCards(this.gameid, this.username);
    } catch (err) {
      this.error = err.message;
      console.log(err.message);
    }
  },
  mounted() {
    // now registering all the socket callbacks.
    this.socket.on("new_hand", newHand => {
      this.playerHand = newHand;
    });

    this.socket.on("game_update", theGame => {
      let jb = boardObj.rows;
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          if (theGame.board[i][j] != "u") {
            jb[i][j].isOccupied = true;
            jb[i][j].fill = fills[theGame.board[i][j].toLowerCase()];
          }
        }
      }

      this.jsonBoard = jb;

      this.playerTurn = theGame.playerTurn == this.username;

      console.log("this.playerTurn=" + this.playerTurn);
      this.players = theGame.players;

      for (let p of theGame.players) {
        if (this.username !== p.name) {
          this.opponent = p;
          break;
        }
      }
      this.theWinner = theGame.theWinner;
      this.winnerFound = theGame.winnerFound;
    });
  }
};
</script>

<style scoped>
.players-hand {
  margin: 1em;
  background: #797386;
  padding: 1em;
}
.players-card {
  margin: 0.5em;
}
.board {
  background: #a3a3a3;
}
</style>
