<template>
  <div id="dashboard">
    <transition name="fade">
      <CommentModal
        v-if="showCommentModal"
        :post="
          this.posts.find((post) => post.id === this.selectedCommentPostId)
        "
        @close="toggleCommentModal()"
      />
    </transition>
    <transition name="fade">
      <FullPostModal
        v-if="showPostModal"
        :comments="postComments"
        :post="posts.find((post) => post.id === this.selectedFullPostId)"
        :formatDate="formatDate"
        @likePost="likePost"
        @close="closePostModal()"
      />
    </transition>

    <section>
      <div class="col1">
        <div class="profile">
          <h5>n</h5>
          <p></p>
          <div class="create-post">
            <p>create a post</p>
            <form @submit.prevent>
              <textarea v-model.trim="post.content"></textarea>
              <button
                @click="createPost()"
                :disabled="post.content === ''"
                class="button"
              >
                post
              </button>
            </form>
          </div>
        </div>
      </div>
      <div class="col2">
        <div v-if="posts.length">
          <div v-for="post in posts" :key="post.id" class="post">
            <h5>{{ post.userName }}</h5>
            <span>{{ formatDate(post.createdOn) }}</span>
            <p>{{ trimContent(post.content) }}</p>
            <ul>
              <li>
                <a @click="toggleCommentModal(post)"
                  >comments {{ post.comments }}</a
                >
              </li>
              <li>
                <a @click="likePost(post.id, post.likes)"
                  >likes {{ post.likes }}</a
                >
              </li>
              <li><a @click="viewPost(post)">view full post</a></li>
            </ul>
          </div>
        </div>
        <div v-else>
          <p class="no-results">There are currently no posts</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
import CommentModal from "@/components/CommentModal";
import FullPostModal from "@/components/FullPostModal";

import { commentsCollection } from "@/firebase";

export default {
  components: {
    CommentModal,
    FullPostModal,
  },
  data() {
    return {
      post: {
        content: "",
      },
      showCommentModal: false,
      selectedCommentPostId: "",
      showPostModal: false,
      selectedFullPostId: "HIcJLjHUil7iwT68KWJs",
      postComments: [],
    };
  },
  computed: {
    ...mapState(["userProfile", "posts"]),
    selectedFullPost: () =>
      this.posts.find((post) => post.id === this.selectedFullPostId),
    selectedCommentPost: () =>
      this.posts.find((post) => post.id === this.selectedCommentPostId),
  },
  methods: {
    createPost() {
      this.$store.dispatch("createPost", { content: this.post.content });
      this.store.content = "";
    },
    trimContent(val) {
      if (val.length < 200) {
        return val;
      }
      return `${val.substring(0, 200)}...`;
    },
    formatDate(val) {
      if (!val) {
        return "-";
      }

      const date = val.toDate();
      return moment(date).fromNow();
    },
    toggleCommentModal(post) {
      this.showCommentModal = !this.showCommentModal;

      // set the selected post in state, if opening the modal
      if (this.showCommentModal) {
        this.selectedCommentPostId = post.id;
      } else {
        this.selectedCommentPostId = "";
      }
    },
    likePost(id, likesCount) {
      this.$store.dispatch("likePost", { id, likesCount });
      // need to update the full post, in case
    },
    async viewPost(post) {
      // get all comments
      const commentDocs = await commentsCollection
        .where("postId", "==", post.id)
        .get();
      const comments = [];

      commentDocs.forEach((commentDoc) => {
        const comment = commentDoc.data();
        comment.id = commentDoc.id;
        comments.push(comment);
      });
      this.postComments = comments;
      this.selectedFullPostId = post.id;
      console.log("selectedFullPostId", this.selectedFullPostId);
      this.showPostModal = true;
    },
    closePostModal() {
      this.postComments = [];
      this.showPostModal = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
