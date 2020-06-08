import Vue from "vue";
import Vuex from "vuex";
import router from "../router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentUser: null,
    games: [],
    errors: null,
    successes: null,
  },
  mutations: {
    setCurrentUser: (state, payload) => (state.currentUser = payload),
    setGames: (state, payload) => (state.games = payload),
    setErrors: (state, payload) => (state.errors = payload),
    setSuccesses: (state, payload) => (state.successes = payload),
  },
  actions: {
    getGameData(context) {
      //let url = "https://sleepy-everglades-99280.herokuapp.com";
      fetch("/api/games", {
        // url + ...
        credentials: "include",
        method: "GET",
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(response.statusText);
        })
        .then((json) => {
          context.commit("setCurrentUser", json.currentUser);
          context.commit("setGames", json.games);
        })
        .catch((error) => {
          this.error = error;
          //console.log("Request failed: " + error.message);
        });
    },
    loginPost(context, userData) {
      //let url = "https://sleepy-everglades-99280.herokuapp.com";
      fetch("/api/login", {
        // url + ...
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
        body: getBody(userData),
      })
        .then((data) => {
          //console.log("Request success: ", data);
          if (data.status == 200) {
            context.commit("setSuccesses", "Successfully logged in!");
            context.dispatch("getGameData");
          }
          if (data.status == 401) {
            context.commit(
              "setErrors",
              "Wrong user name or password! Try again!"
            );
          }
        })
        .catch((error) => {
          this.error = error;
          //console.log("Request failure: ", error);
        });
      function getBody(json) {
        var body = [];
        for (var key in json) {
          var encKey = encodeURIComponent(key);
          var encVal = encodeURIComponent(json[key]);
          body.push(encKey + "=" + encVal);
        }
        //console.log(body.join("&"));
        return body.join("&");
      }
    },
    signupPost(context, userData) {
      //let url = "https://sleepy-everglades-99280.herokuapp.com";
      fetch("/api/players", {
        // url + ...
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(userData),
      })
        .then((data) => {
          //console.log("Request success: ", data);
          if (data.ok) {
            context.dispatch("loginPost", {
              userName: userData.userName,
              password: userData.password,
            });
            router.push("/");
          }
          if (data.status == 403) {
            context.commit("setErrors", "This user already exists!");
          }
          if (data.status == 401) {
            context.commit(
              "setErrors",
              "Woops! You're missing something in the sign up form!"
            );
          }
        })
        .then((data) => {
          this.data = data;
          //console.log(data);
          //context.commit("setErrors", "This user already exists!");
        })
        .catch((error) => {
          this.error = error;
          //console.log("Request failure: ", error);
        });
    },
    errorsTimeOut(context) {
      context.commit("setErrors", null);
    },
    successesTimeOut(context) {
      context.commit("setSuccesses", null);
    },
  },
  getters: {
    getCurrentUser: (state) => state.currentUser,
    getGames: (state) => state.games,
    getErrors: (state) => state.errors,
    getSuccesses: (state) => state.successes,
  },
});
