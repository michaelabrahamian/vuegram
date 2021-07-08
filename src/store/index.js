import { createStore } from "vuex";
import * as fb from "../firebase";
import router from "../router/index";

const store = createStore({
  state: {
    userProfile: {},
    posts: [],
  },
  mutations: {
    setUserProfile(state, val) {
      state.userProfile = val;
    },
    setPosts(state, val) {
      state.posts = val;
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
    async createPost({ state }, post) {
      await fb.postsCollection.add({
        createdOn: new Date(),
        content: post.content,
        userId: fb.auth.currentUser.uid,
        userName: state.userProfile.name,
        comments: 0,
        likes: 0,
      });
    },
    async likePost(_, post) {
      const userId = fb.auth.currentUser.uid;
      const docId = `${userId}_${post.id}`;
      console.log("liking post", post);

      // check if the user has likes post (if there is a matching like document)
      const likeDoc = await fb.likesCollection.doc(docId).get();

      // remove the like if it exists, then return
      if (likeDoc.exists) {
        try {
          await fb.likesCollection.doc(docId).delete();

          // decrement likes count
          fb.postsCollection.doc(post.id).update({
            likes: post.likesCount - 1,
          });
        } catch (error) {
          console.log("unable to remove like");
        }
        return;
      }

      // create post
      await fb.likesCollection.doc(docId).set({
        postId: post.id,
        userId: userId,
      });

      // increment likes count
      fb.postsCollection.doc(post.id).update({
        likes: post.likesCount + 1,
      });
    },
    async updateProfile({ dispatch }, user) {
      const userId = fb.auth.currentUser.uid;

      // update the fields in the user object
      await fb.usersCollection.doc(userId).update({
        name: user.name,
        title: user.title,
      });

      // update the user profile in the store
      dispatch("fetchUserProfile", { uid: userId });

      // update the user's name in their posts
      const postDocs = await fb.postsCollection
        .where("userId", "==", userId)
        .get();
      postDocs.forEach((postDoc) => {
        fb.postsCollection.doc(postDoc.id).update({
          userName: user.name,
        });
      });

      // update the user's name in their comments
      const commentDocs = await fb.commentsCollection
        .where("userId", "==", userId)
        .get();
      commentDocs.forEach((commentDoc) => {
        fb.commentsCollection.doc(commentDoc.id).update({
          userName: user.name,
        });
      });
    },
  },
  modules: {},
});

fb.postsCollection.orderBy("createdOn", "desc").onSnapshot((snapshot) => {
  const postsArray = [];

  snapshot.forEach((doc) => {
    const post = doc.data();
    post.id = doc.id;

    postsArray.push(post);
  });

  store.commit("setPosts", postsArray);
});

export default store;
