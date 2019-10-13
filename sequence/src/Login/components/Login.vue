<template>
  <div class="form-signin">
    <img
      class="mb-4"
      src="../assets/img/logo.svg"
      alt=""
      width="72"
      height="72"
    />
    <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
    <label for="inputName" class="sr-only">Email address</label>
    <input
      v-model="username"
      v-on:keyup.enter="newGame"
      type="text"
      id="inputName"
      class="form-control my-top-input"
      placeholder="Username"
      required
      autofocus
    />
    <label for="inputGameId" class="sr-only">Password</label>
    <input
      v-model="gameid"
      v-on:keyup.enter="attemptLogin"
      type="text"
      id="inputGameId"
      class="form-control my-bottom-input"
      placeholder="Game ID (leave blank if new game)"
    />
    <!-- <div class="checkbox mb-3">
        <label>
          <input type="checkbox" value="remember-me"> Remember me
        </label>
      </div> -->
    <button
      v-on:click="newGame"
      v-bind:disabled="gameid.length > 0 || username.length <= 0"
      class="btn btn-lg btn-primary btn-block"
    >
      New Game
    </button>
    <button
      v-on:click="attemptLogin"
      v-bind:disabled="gameid.length <= 0 || username.length <= 0"
      class="btn btn-lg btn-primary btn-block"
    >
      Join Existing
    </button>
    <div class="mt-5 mb-3 text-muted">
      COSC560 | Sequence <br /><small> by J.Crowley 220202294</small>
      <div>
        <small
          >Icons made by
          <a href="https://www.flaticon.com/authors/twitter" title="Twitter"
            >Twitter</a
          >
          from
          <a href="https://www.flaticon.com/" title="Flaticon"
            >www.flaticon.com</a
          ></small
        >
      </div>
    </div>
  </div>
</template>

<script>
const baseUrl = "http://" + window.location.hostname + ":50135/api/game";

export default {
  name: "Login",
  props: {
    msg: String
  },
  data() {
    return {
      username: "",
      gameid: ""
    };
  },
  methods: {
    attemptLogin: async function() {
      try {
        const res = await fetch(
          baseUrl + "?gameid=" + this.gameid + "&username=" + this.username
        );
        const resj = await res.json();
        localStorage.setItem("gameid", this.gameid);
        localStorage.setItem("username", this.username);
        this.$emit("next-app", "GameApp");
      } catch (err) {
        this.error = err.message;
        console.log(err.message);
      }
    },
    newGame: async function() {
      try {
        const res = await fetch(baseUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: this.username
          })
        });
        const resj = await res.json();
        console.log(resj);
        localStorage.setItem("gameid", resj.gameid);
        localStorage.setItem("username", this.username);
        this.$emit("next-app", "GameApp");
        // if(!isProduction) {
        //   window.location.replace("http://localhost:8080");
        // } else {
        //   await fetch(redirectUrl);
        // }
      } catch (err) {
        this.error = err.message;
        console.log(err.message);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 14px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.my-top-input {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.my-bottom-input {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
