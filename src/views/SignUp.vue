<template>
  <div>
    <form id="signup-form" onsubmit="return false">
      <label>
        User Name:
        <input v-model="userData.userName" type="text" name="name" />
      </label>
      <label>
        User Email:
        <input v-model="userData.userEmail" type="text" name="email" />
      </label>
      <label>
        Password:
        <input v-model="userData.password" type="password" name="password" />
      </label>
      <button @click="signupPost(userData)">Sign up</button>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      userData: {
        userName: "",
        userEmail: "",
        password: ""
      }
    };
  },
  computed: {},
  methods: {
    ...mapActions(["signupPost"])
  }
};
</script>

<style scoped>
input {
  border: solid;
  border-width: 1px;
}
button {
  border: solid;
  border-width: 1px;
}
</style>