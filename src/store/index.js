import Vue from "vue";
import Vuex from "vuex";
import router from "../router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentUser: null,
    games: [],
  },
  mutations: {
    setCurrentUser: (state, payload) => (state.currentUser = payload),
    setGames: (state, payload) => (state.games = payload),
  },
  actions: {
    getGameData(context) {
      let url = "https://sleepy-everglades-99280.herokuapp.com";
      fetch(url + "/api/games", {
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
      let url = "https://sleepy-everglades-99280.herokuapp.com";
      fetch(url + "/api/login", {
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
            context.dispatch("getGameData");
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
      let url = "https://sleepy-everglades-99280.herokuapp.com";
      fetch(url + "/api/players", {
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
        })
        .catch((error) => {
          this.error = error;
          //console.log("Request failure: ", error);
        });
    },
  },
  getters: {
    getCurrentUser: (state) => state.currentUser,
    getGames: (state) => state.games,
  },
});
