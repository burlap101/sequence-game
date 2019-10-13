<template>
  <div id="loginapp" class="vue-app text-center">
    <Login v-on:next-app="$emit('next-app', $event)" />
  </div>
</template>

<script>
import Login from "./components/Login.vue";

export default {
  name: "LoginApp",
  components: {
    Login
  }
};
</script>

<style scoped>
.vue-app {
  height: 100vh;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}
</style>
