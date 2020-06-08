<template>
  <div>
    <div>
      <h2>Games</h2>
      <ol>
        <li v-for="game in getGames" :key="game.id">
          <template>
            {{game.created}} - {{game.gamePlayers[0].player.username}} V.S
            <span
              v-if="game.gamePlayers[1]"
            >{{game.gamePlayers[1].player.username}}</span>
            <span v-else>Waiting for an opponent...</span>
          </template>
          <router-link v-if="getCurrentUser && getGpId(game)" :to="'/gameView/' + getGpId(game)">
            <button>Rejoin game!</button>
          </router-link>
          <button
            v-if="getCurrentUser != null && game.gamePlayers.length < 2 && game.gamePlayers[0].player.id != getCurrentUser.id"
            @click="joinGamePost(game.id)"
          >Join game!</button>
        </li>
      </ol>
      <button v-if="getCurrentUser" @click="createGamePost">Create New Game!</button>
    </div>
    <div>
      <h2>LeaderBoard</h2>
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-center">Player</th>
              <th class="text-center">Wins</th>
              <th class="text-center">Losses</th>
              <th class="text-center">Ties</th>
              <th class="text-center">Total Score</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(value, key, index) in sortLB" :key="index">
              <td class="text-center">{{key}}</td>
              <td class="text-center">{{value.wins}}</td>
              <td class="text-center">{{value.losses}}</td>
              <td class="text-center">{{value.ties}}</td>
              <td class="text-center">{{value.totalScore}}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>
  </div>
</template>

<script>
import router from "../router";
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      leaderBoard: []
    };
  },
  computed: {
    ...mapGetters(["getGames", "getCurrentUser"]),
    sortLB() {
      let sorted = {};
      Object.keys(this.leaderBoard)
        .sort((a, b) => {
          return (
            this.leaderBoard[b].totalScore - this.leaderBoard[a].totalScore
          );
        })
        .forEach(key => {
          sorted[key] = this.leaderBoard[key];
        });
      return sorted;
    }
  },
  methods: {
    ...mapActions(["getGameData"]),
    joinGamePost(gID) {
      //let url = "https://sleepy-everglades-99280.herokuapp.com";
      fetch(`/api/game/${gID}/players`, {
        // url + ...
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      })
        .then(function(response) {
          //console.log("Request success: ", response);
          return response.json();
        })
        .then(function(data) {
          if (data.error) {
            //console.log(data.error);
          } else {
            router.push("/gameview/" + data.gpID);
          }
        })
        .catch(function(error) {
          this.error = error;
          //console.log("Request failure: ", error);
        });
    },
    getGpId(game) {
      for (let index in game.gamePlayers) {
        let gp = game.gamePlayers[index];
        if (this.getCurrentUser.id == gp.player.id) {
          return gp.id;
        }
      }
      return null;
    },
    createGamePost() {
      //let url = "https://sleepy-everglades-99280.herokuapp.com";
      fetch("/api/games", {
        //url + ...
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      })
        .then(function(response) {
          //console.log("Request success: ", response);
          return response.json();
        })
        .then(function(data) {
          if (data.error) {
            //console.log(data.error);
          } else {
            router.push("/gameview/" + data.gpID);
          }
          //console.log(data);
        })
        .catch(function(error) {
          this.error = error;
          //console.log("Request failure: ", error);
        });
    },
    getLBdata() {
      //let url = "https://sleepy-everglades-99280.herokuapp.com";
      fetch("/api/leader_board", {
        // url + ...
        credentials: "include",
        method: "GET"
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(response.statusText);
        })
        .then(json => {
          //console.log(json);
          this.leaderBoard = json;
        })
        .catch(error => {
          this.error = error;
          //console.log("Request failed:" + error.message);
        });
    }
  },
  created() {
    this.getGameData();
    this.getLBdata();
  }
};
</script>

<style scoped>
button {
  border: solid;
  border-width: 1px;
  border-color: black;
  color: black;
}
</style>