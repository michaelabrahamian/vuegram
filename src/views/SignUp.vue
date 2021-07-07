<template>
  <form @submit.prevent>
    <h1>Get Started</h1>
    <div>
      <label for="name">Name</label>
      <input
        v-model.trim="signupForm.name"
        type="text"
        placeholder="John Wick"
        id="name"
      />
    </div>
    <div>
      <label for="title">Title</label>
      <input
        v-model.trim="signupForm.title"
        type="text"
        placeholder="Mr"
        id="title"
      />
    </div>
    <div>
      <label for="email2">Email</label>
      <input
        v-model.trim="signupForm.email"
        type="text"
        placeholder="you@email.com"
        id="email2"
      />
    </div>
    <div>
      <label for="password2">Password</label>
      <input
        v-model.trim="signupForm.password"
        type="password"
        placeholder="min 6 characters"
        id="password2"
      />
    </div>
    <button @click="signup()" class="button">Sign Up</button>
    <div class="extras">
      <a>Back to Log In</a>
    </div>
  </form>
</template>

<script>
export default {
  data() {
    return {
      signupForm: {
        name: "",
        title: "",
        email: "",
        password: "",
      },
    };
  },
  methods: {
    signup() {
      this.$store.dispatch("signup", {
        name: this.signupForm.name,
        title: this.signupForm.title,
        email: this.signupForm.email,
        password: this.signupForm.password,
      });
    },
  },
};
</script>
