<template>
  <div class="c-container comment-container">
    <a @click="$emit('close')">close</a>
    <p>add a comment</p>
    <form @submit.prevent>
      <textarea v-model.trim="comment"></textarea>
      <button @click="addComment()" :disabled="comment == ''" class="button">
        add comment
      </button>
    </form>
  </div>
</template>

<script>
import { auth, commentsCollection, postsCollection } from "../firebase";
export default {
  props: ["post"],
  data() {
    return {
      comment: "",
    };
  },
  methods: {
    async addComment() {
      await commentsCollection.add({
        createdOn: new Date(),
        content: this.comment,
        postId: this.post.id,
        userId: auth.currentUser.uid,
        userName: this.$store.state.userProfile.name,
      });

      await postsCollection.doc(this.post.id).update({
        comments: parseInt(this.post.comments) + 1,
      });

      this.$emit("close");
      this.$emit("addComment");
    },
  },
};
</script>

<style lang="scss" scoped>
.comment-container {
  max-width: 800px;
  margin: auto;
}
</style>
