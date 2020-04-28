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
      }
    };
  },
  computed: {
    ...mapGetters(["getCurrentUser"])
  },
  created() {
    this.getGameData();
  },
  methods: {
    ...mapActions(["loginPost", "getGameData"]),
    logoutPost() {
      let url = "https://sleepy-everglades-99280.herokuapp.com";
      fetch(url + "/api/logout", {
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
      })
        .then(data => {
          console.log("Request success: ", data);
          if (data.status == 200) {
            this.getGameData();
          }
        })
        .catch(error => {
          console.log("Request failure: ", error);
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