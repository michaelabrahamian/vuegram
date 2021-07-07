import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./firebase";
import "./assets/scss/app.scss";
import { auth } from "./firebase";

let app;
auth.onAuthStateChanged((user) => {
  if (!app) {
    app = createApp(App).use(store).use(router).mount("#app");
  }

  if (user) {
    store.dispatch("fetchUserProfile", user);
  }
});
