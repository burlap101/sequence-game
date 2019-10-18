/**
 * main.js
 * J.Crowley 220202294
 * Main entry point for vue app overall
 */

import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;
Vue.config.devtools = true;

new Vue({
  render: h => h(App)
}).$mount("#app");
