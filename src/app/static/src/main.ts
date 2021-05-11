import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vue from "vue";

export const app = new Vue({
  el: "#app",
  render: h => h(App),
  store,
  router
});
