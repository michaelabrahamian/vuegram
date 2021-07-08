<template>
  <!-- full post modal -->
  <div class="p-modal">
    <div class="p-container">
      <a @click="$emit('close')" class="close">close</a>
      <div class="post">
        <h5>{{ post.userName }}</h5>
        <span>{{ formatDate(post.createdOn) }}</span>
        <p>{{ post.content }}</p>
        <ul>
          <li>
            <a @click="toggleCommentForm()">comments {{ post.comments }}</a>
          </li>
          <li>
            <a @click="this.$emit('likePost', post.id, post.likes)"
              >likes {{ post.likes }}</a
            >
          </li>
        </ul>
      </div>
      <CommentModal
        v-if="showCommentForm"
        :post="post"
        @close="toggleCommentForm()"
        @addComment="this.$emit('addComment')"
      />
      <div v-show="comments.length" class="comments">
        <div v-for="comment in comments" :key="comment.id" class="comment">
          <p>{{ comment.userName }}</p>
          <span>{{ formatDate(comment.createdOn) }}</span>
          <p>{{ comment.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CommentModal from "@/components/CommentModal";
export default {
  props: ["comments", "post", "formatDate"],
  components: {
    CommentModal,
  },
  data() {
    return {
      showCommentForm: true,
    };
  },
  methods: {
    toggleCommentForm() {
      console.log("toggling from", this.showCommentForm);
      this.showCommentForm = !this.showCommentForm;
    },
  },
};
</script>
