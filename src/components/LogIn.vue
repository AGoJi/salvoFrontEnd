<template>
  <div>
    <form id="login-form" onsubmit="return false" v-if="!getCurrentUser">
      <label>
        User Name:
        <input v-model="userData.userName" type="text" name="name" />
      </label>
      <label>
        Password:
        <input v-model="userData.password" type="password" name="password" />
      </label>
      <button @click="loginPost(userData)">Log in</button>
    </form>
    <form id="logout-form" onsubmit="return false" v-else>
      <button @click="logoutPost">Log out</button>
    </form>
    <v-overlay v-if="getErrors" opacity="0.1">
      <v-alert type="error" prominent>{{getErrors}}</v-alert>
    </v-overlay>
    <v-overlay v-if="getSuccesses" opacity="0.1">
      <v-alert type="success" prominent>{{getSuccesses}}</v-alert>
    </v-overlay>
    <v-overlay v-if="successes" opacity="0.1">
      <v-alert type="success" prominent>{{successes}}</v-alert>
    </v-overlay>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      userData: {
        userName: "",
        password: ""
      },
      successes: null
    };
  },
  computed: {
    ...mapGetters(["getCurrentUser", "getErrors", "getSuccesses"])
  },
  watch: {
    getErrors() {
      setTimeout(() => {
        this.errorsTimeOut();
      }, 3000);
    },
    getSuccesses() {
      setTimeout(() => {
        this.successesTimeOut();
      }, 3000);
    },
    successes() {
      setTimeout(() => {
        this.successes = null;
      }, 3000);
    }
  },
  created() {
    this.getGameData();
  },
  methods: {
    ...mapActions([
      "loginPost",
      "getGameData",
      "errorsTimeOut",
      "successesTimeOut"
    ]),
    logoutPost() {
      //let url = "https://sleepy-everglades-99280.herokuapp.com";
      fetch("/api/logout", {
        // url + ...
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
      })
        .then(data => {
          //console.log("Request success: ", data);
          if (data.status == 200) {
            this.successes = "Successfully logged out!";
            this.getGameData();
          }
        })
        .catch(error => {
          this.error = error;
          //console.log("Request failure: ", error);
        });
    }
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