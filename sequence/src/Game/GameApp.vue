<template>
  <div id="theGameComponent">
    <div class="row">
      <div class="col-8">
        <TheGame
          v-bind:socket="socket"
          v-bind:myopponent="opponent"
          v-bind:username="username"
          v-bind:gameid="gameid"
        />
      </div>
      <div class="col-4">
        <Chat v-bind:socket="socket" 
          v-bind:opponent="opponent"
          v-on:username-cmd="updateUsername"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TheGame from "./components/TheGame.vue";
import Chat from "./components/Chat.vue";
import io from "socket.io-client";

const port = 50135;

export default {
  name: "GameApp",
  components: {
    TheGame,
    Chat
  },
  data() {
    return {
      socket: io(window.location.protocol + "//" + window.location.hostname + ":" + port),
      opponent: {
        name: "Mr-Nobody"
      },
      username: localStorage.getItem("username"),
      gameid: localStorage.getItem("gameid")
    };
  },
  methods: {
    updateUsername: function(newName) {
      this.username = newName.trim();
    }
  },
  created() {
    if (this.gameid !== undefined || this.username !== undefined) {
      this.socket.emit("join_room", {
        gameid: this.gameid,
        username: this.username
      });
    } else {
      console.log("Something went wrong with retrieving from localStorage");
    }
  },
  beforeMount() {
    this.socket.on("player_joined", opponent => {
      this.opponent = opponent;
    });
  }
};
</script>

<style>
.starter-template {
  padding: 3rem 1.5rem;
  text-align: center;
}
</style>
