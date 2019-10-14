<template>
  <div class="card my-chat">
    <div class="card-body">
      <h4 class="card-title">Chat</h4>
    </div>
    <div id="chat-window" class="overflow-auto my-messages">
      <ul class="list-group list-group-flush my-message-item">
        <li
          class="list-group-item my-message-item"
          v-for="message in messages"
          v-bind:key="message._id"
        >
          {{ message.who }} @ {{ message.when }} > {{ message.text }}
        </li>
      </ul>
    </div>
    <div id="chat-entry" class="card-body">
      <div class="input-group">
        <textarea
          class="input-group-text text-left w-100"
          rows="3"
          v-model="message.text"
          v-on:keyup.enter="sendMessage"
          v-bind:disabled="isDisabled"
        ></textarea>
        <button
          class="btn btn-primary mt-2"
          type="button"
          v-on:click="sendMessage"
          v-bind:disabled="isDisabled"
        >
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ChatService } from "../assets/js/ChatService";

export default {
  name: "Chat",
  props: ["socket", "opponent"],
  data() {
    return {
      message: {
        who: localStorage.getItem("username"),
        text: "",
        gameid: localStorage.getItem("gameid")
      },
      messages: [],
      serverStatus: "",
      isDisabled: false
    };
  },
  methods: {
    sendMessage: function() {
      // All messages handled here
      if (this.message.text != "") {
        this.socket.emit("new_chat_message", this.message);
        this.messages.push({
          who: this.message.who,
          text: this.message.text,
          when: new Date().toTimeString().split(" ")[0]
        });
      }

      // commands that alter Vue data dealt with here
      if (this.message.text.startsWith("!")) {
        let theCommand = this.message.text.toLowerCase();
        if (theCommand.startsWith("!username")) {
          this.message.who = this.message.text.split(" ")[1].trim();
          this.$emit("username-cmd", this.message.who);
        }
      }

      this.message.text = "";
    }
  },
  watch: {
    opponent: function() {
      this.messages.push({
        who: "Gamebot",
        text:
          "Welcome " +
          this.opponent.name +
          " who has come to challenge the champ! (he totally can't read this btw)",
        when: new Date().toTimeString().split(" ")[0]
      });
    }
  },
  async created() {
    console.log("attempting to get chat messages");
    try {
      this.messages = await ChatService.getMessages(this.gameid);
    } catch (err) {
      this.error = err.message;
      console.log(err.message);
    }
  },
  mounted() {
    // register the socket message types to look out for chat
    this.socket.on("new_chat_message", (data) => {
      data.when = new Date().toTimeString().split(" ")[0];
      this.messages.push(data);
    });
    this.socket.on("status", (message) => {
      this.messages.push({
        who: "Gamebot",
        text: message,
        when: new Date().toTimeString().split(" ")[0]
      });
    });
    this.socket.on("kick", (reason) => {
      this.messages.push({
        who: "Gamebot",
        text: "You have been kicked: " + reason.text,
        when: new Date().toTimeString().split(" ")[0]
      });
      this.isDisabled = true;
    });
  },
  beforeDestroy() {
    console.log("beforeDestroy called.");
  },
  updated() {
    let chatWindow = document.getElementById("chat-window");
    if (chatWindow == undefined) {
      console.log(
        "something went wrong obtaining reference to the chat window"
      );
    }
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
};
</script>

<style scoped>
.my-chat {
  width: 25rem;
}
.my-messages {
  max-height: 125px;
  max-width: 23rem;
  height: 200px;
  margin: 0 20px;
  font-size: 13px;
  background: #bebebe;
}

.my-message-item {
  background: #bebebe;
}
</style>
