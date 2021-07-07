import { createStore } from "vuex";
import * as fb from "../firebase";
import router from "../router/index";

export default createStore({
  state: {
    userProfile: {},
  },
  mutations: {
    setUserProfile(state, val) {
      state.userProfile = val;
    },
  },
  actions: {
    async login({ dispatch }, form) {
      // sign in
      const { user } = await fb.auth.signInWithEmailAndPassword(
        form.email,
        form.password
      );

      // get the user's profile and store in state
      dispatch("fetchUserProfile", user);
    },
    async fetchUserProfile({ commit }, user) {
      const userProfile = await fb.usersCollection.doc(user.uid).get();

      // store user profile in state
      commit("setUserProfile", userProfile.data());

      router.push("/");
    },
    async signup({ dispatch }, form) {
      // sign up
      const { user } = await fb.auth.createUserWithEmailAndPassword(
        form.email,
        form.password
      );

      // create and add user profile object to the userCollections
      await fb.usersCollection
        .doc(user.uid)
        .set({ name: form.name, title: form.title });

      dispatch("fetchUserProfile", user);
    },
    async logout({ commit }) {
      await fb.auth.signOut();

      // clear user profile
      commit("setUserProfile", {});
      router.push("/login");
    },
  },
  modules: {},
});
