import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

export const app = new Vue({
    el: "#app",
    render: (h) => h(App),
    store,
    router
});
