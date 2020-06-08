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
    <v-overlay v-if="getErrors" opacity="0.1">
      <v-alert type="error" prominent>{{getErrors}}</v-alert>
    </v-overlay>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
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
  computed: {
    ...mapGetters(["getErrors"])
  },
  watch: {
    getErrors() {
      setTimeout(() => {
        this.errorsTimeOut();
      }, 3000);
    }
  },
  methods: {
    ...mapActions(["signupPost", "errorsTimeOut"])
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