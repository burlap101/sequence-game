<template>
  <div id="the-mother-app">
    <Navbar v-bind:gameid="gameid" />
    <component
      v-bind:is="currentAppComponent"
      v-on:next-app="changeCurrentApp"
    ></component>
  </div>
</template>

<script>
import LoginApp from "./Login/LoginApp.vue";
import GameApp from "./Game/GameApp.vue";
import Navbar from "./Navbar/components/Navbar.vue";

export default {
  name: "app",
  components: {
    LoginApp,
    GameApp,
    Navbar
  },
  data() {
    return {
      currentAppComponent: "LoginApp",
      gameid: ""
    };
  },
  methods: {
    changeCurrentApp: function(appName) {
      this.currentAppComponent = appName;
    }
  },
  created() {
    localStorage.clear();
  },
  updated() {
    this.gameid = localStorage.getItem("gameid");
  }
};
</script>

<style>
body {
  padding-top: 5rem;
  padding-left: 2rem;
  padding-right: 2rem;
  background: rgb(170, 170, 170);
}
</style>
