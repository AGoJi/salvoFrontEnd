<template>
  <div v-if="gameView">
    <h2>Game View</h2>
    <p v-for="(gameplayer, i) in gameView.gameplayers" :key="i">
      <span v-if="gameplayer.id == gpID">You: {{gameplayer.player.username}}</span>
      <span v-else>Opponent: {{gameplayer.player.username}}</span>
    </p>
    <p>Game Status: {{gameView.status}}</p>
    <div class="flexgrids">
      <div>
        <h3>Ship Grid</h3>
        <div class="grid-container" @dragover.prevent @drop.prevent="drop">
          <div v-for="(col, i) in grid.cols" :key="i">
            <div v-for="(cell, i) in grid.rows" :key="i" :id="cell+col+'m'" class="grid-item"></div>
          </div>
        </div>
        <button v-if="gameView && gameView.ships.length < 5" @click="placeShipsPost()">Place ships!</button>
        <div v-if="gameView && gameView.ships.length < 5">
          <h3>Ships to place:</h3>
          <div class="grid-container shipContainer">
            <div
              id="ship_id1"
              class="ship1"
              :draggable="true"
              data-shiplength="2"
              data-shiptype="Patrol Boat"
              data-position="0"
              data-orientation="v"
              @dragstart="dragStart"
              @dragover.stop
            >
              <span class="rotationButton" @click="changeShipOrientation('ship_id1')">@</span>
            </div>
            <div
              id="ship_id2"
              class="ship2"
              :draggable="true"
              data-shiplength="3"
              data-shiptype="Destroyer"
              data-position="1"
              data-orientation="v"
              @dragstart="dragStart"
              @dragover.stop
            >
              <span class="rotationButton" @click="changeShipOrientation('ship_id2')">@</span>
            </div>
            <div
              id="ship_id3"
              class="ship3"
              :draggable="true"
              data-shiplength="3"
              data-shiptype="Submarine"
              data-position="2"
              data-orientation="v"
              @dragstart="dragStart"
              @dragover.stop
            >
              <span class="rotationButton" @click="changeShipOrientation('ship_id3')">@</span>
            </div>
            <div
              id="ship_id4"
              class="ship4"
              :draggable="true"
              data-shiplength="4"
              data-shiptype="Battleship"
              data-position="3"
              data-orientation="v"
              @dragstart="dragStart"
              @dragover.stop
            >
              <span class="rotationButton" @click="changeShipOrientation('ship_id4')">@</span>
            </div>
            <div
              id="ship_id5"
              class="ship5"
              :draggable="true"
              data-shiplength="5"
              data-shiptype="Carrier"
              data-position="4"
              data-orientation="v"
              @dragstart="dragStart"
              @dragover.stop
            >
              <span class="rotationButton" @click="changeShipOrientation('ship_id5')">@</span>
            </div>
          </div>
        </div>
      </div>
      <v-overlay v-if="errors" opacity="0.1">
        <v-alert type="error" prominent>{{errors}}</v-alert>
      </v-overlay>
      <v-overlay v-if="successes" opacity="0.1">
        <v-alert type="success" prominent>{{successes}}</v-alert>
      </v-overlay>
      <div>
        <h3>Salvo Grid</h3>
        <div class="grid-container">
          <div v-for="(col, i) in grid.cols" :key="i">
            <div
              v-for="(cell , i) in grid.rows"
              :key="i"
              :id="cell+col+'y'"
              class="grid-item"
              @click="placeSalvoes(cell, col)"
            ></div>
          </div>
        </div>
        <button
          v-if="gameView && gameView.gameplayers.length == 2 && gameView.ships.length == 5 && !gameView.status.includes('Waiting') && !gameView.status.includes('Victory') && !gameView.status.includes('Defeat')"
          @click="placeSalvoesPost"
        >Fire Salvoes!</button>
        <h3>Opponent's Ships:</h3>
        <div class="grid-container shipContainer">
          <div id="enemyShip1" class="ship1"></div>
          <div id="enemyShip2" class="ship2"></div>
          <div id="enemyShip3" class="ship3"></div>
          <div id="enemyShip4" class="ship4"></div>
          <div id="enemyShip5" class="ship5"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    gpID: String
  },
  data() {
    return {
      grid: {
        cols: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
      },
      gameView: null,
      status: null,
      interval: null,
      errors: null,
      successes: null,
      shipData: [
        { shipType: "Patrol Boat", shipLocations: [] },
        { shipType: "Destroyer", shipLocations: [] },
        { shipType: "Submarine", shipLocations: [] },
        { shipType: "Battleship", shipLocations: [] },
        { shipType: "Carrier", shipLocations: [] }
      ],
      cellID: "",
      changeOrientation: false,
      salvoData: { salvoLocation: [] }
    };
  },
  methods: {
    drop(e) {
      const ship_id = e.dataTransfer.getData("ship");
      const ship = document.getElementById(ship_id);
      let saveLocations = this.shipData[ship.dataset.position].shipLocations;
      this.shipData[ship.dataset.position].shipLocations = [];
      if (
        this.placeShipsErrors(
          ship,
          e.target.id.slice(0, e.target.id.length - 1)
        )
      ) {
        ship.style.display = "block";
        ship.classList.add("ship");
        e.target.appendChild(ship);
        this.cellID = e.target.id.slice(0, e.target.id.length - 1);
        this.setShipData(ship);
      } else {
        this.shipData[ship.dataset.position].shipLocations = saveLocations;
        //console.log("Invalid ship location, try again!");
        this.errors = "Invalid ship location, try again!";
      }
    },
    dragStart(e) {
      const target = e.target;
      e.dataTransfer.setData("ship", target.id);
    },
    setShipData(ship) {
      let letter = this.cellID.slice(0, 1);
      let letterIndex = this.grid.rows.indexOf(letter);
      let number = Number(this.cellID.slice(1));
      this.shipData[ship.dataset.position].shipLocations = [];
      for (let i = 0; i < ship.dataset.shiplength; i++) {
        if (ship.dataset.orientation == "v") {
          this.shipData[ship.dataset.position].shipLocations.push(
            this.grid.rows[letterIndex + i] + number
          );
        } else {
          this.shipData[ship.dataset.position].shipLocations.push(
            letter + (number + i)
          );
        }
      }
    },
    changeShipOrientation(id) {
      this.changeOrientation = true;
      let ship = document.getElementById(id);
      let shipNumber = id.slice(id.length - 1);
      this.cellID = ship.parentNode.id.slice(0, ship.parentNode.id.length - 1);
      ship.dataset.orientation == "v"
        ? (ship.dataset.orientation = "h")
        : (ship.dataset.orientation = "v");
      if (this.placeShipsErrors(ship, this.cellID)) {
        if (ship.dataset.orientation == "h") {
          ship.classList.remove("ship" + shipNumber);
          ship.classList.add("ship" + shipNumber + "h");
        }
        if (ship.dataset.orientation == "v") {
          ship.classList.remove("ship" + shipNumber + "h");
          ship.classList.add("ship" + shipNumber);
        }
        this.changeOrientation = false;
        this.setShipData(ship);
      } else {
        ship.dataset.orientation == "v"
          ? (ship.dataset.orientation = "h")
          : (ship.dataset.orientation = "v");
        //console.log("Can't rotate the ship in this position!");
        this.errors = "Can't rotate the ship in this position!";
      }
    },
    placeShipsErrors(ship, id) {
      let letter = id.slice(0, 1);
      let letterIndex = this.grid.rows.indexOf(letter);
      let number = Number(id.slice(1));
      let start = this.changeOrientation ? 1 : 0;
      for (let i = start; i < ship.dataset.shiplength; i++) {
        if (ship.dataset.orientation == "v") {
          if (
            document.getElementById(
              this.grid.rows[letterIndex + i] + number + "m"
            ) == null ||
            this.checkShipPosition(this.grid.rows[letterIndex + i] + number) ==
              false
          ) {
            return false;
          }
        } else {
          if (
            document.getElementById(letter + (number + i) + "m") == null ||
            this.checkShipPosition(letter + (number + i)) == false
          ) {
            return false;
          }
        }
      }
      return true;
    },
    checkShipPosition(id) {
      let posible = true;
      this.shipData.some(singleShip => {
        if (singleShip.shipLocations.includes(id)) {
          posible = false;
          return true;
        }
      });
      return posible;
    },
    placeSalvoes(cell, col) {
      let locationIndex = this.salvoData.salvoLocation.indexOf(cell + col);
      if (
        document.getElementById(cell + col + "y").innerText.length < 1 &&
        document.getElementById(cell + col + "y").classList.contains("salvo")
      ) {
        document.getElementById(cell + col + "y").classList.remove("salvo");
        this.salvoData.salvoLocation.splice(locationIndex, 1);
      } else if (
        document.getElementById(cell + col + "y").innerText.length < 1 &&
        this.salvoData.salvoLocation.length != 5
      ) {
        document.getElementById(cell + col + "y").classList.add("salvo");
        this.salvoData.salvoLocation.push(cell + col);
      }
    },
    placeShipsPost() {
      //let url = "https://sleepy-everglades-99280.herokuapp.com";
      fetch(`/api/games/players/${this.gpID}/ships`, {
        //url + ...
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(this.shipData)
      })
        .then(data => {
          //console.log("Request success: ", data);
          this.getGVdata();
          return data.text();
        })
        .then(data => {
          this.data = data;
          //console.log(data);
          this.successes = "Ships successfully placed!";
        })
        .catch(function(error) {
          this.error = error;
          //console.log("Request failure: ", error);
        });
    },
    placeSalvoesPost() {
      //let url = "https://sleepy-everglades-99280.herokuapp.com";
      fetch(`/api/games/players/${this.gpID}/salvoes`, {
        //url + ...
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(this.salvoData)
      })
        .then(data => {
          //console.log("Request success: ", data);
          if (data.ok) {
            this.successes = "Salvoes successfully placed!";
            this.getGVdata();
            this.salvoData.salvoLocation = [];
          }
          if (data.status == 403) {
            this.errors = "Salvoes must be fired in sets of 5!";
          }
          //return data.text();
        })
        .catch(error => {
          this.error = error;
          //console.log("Request failure: ", error);
        });
    },
    getGVdata() {
      //let url = "https://sleepy-everglades-99280.herokuapp.com";
      fetch(`/api/game_view/${this.gpID}`, {
        //url + ...
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
          this.gameView = json;
          this.status = json.status;
        })
        .catch(error => {
          this.error = error;
          //console.log("Request failed: " + error.message);
        });
    },
    printShips() {
      this.gameView.ships.forEach(ship => {
        ship.shipLocations.forEach(location => {
          const cell = document.getElementById(location + "m");
          cell.classList.add("shipBackend");
        });
      });
    },
    printSalvoes() {
      for (const gpid in this.gameView.salvoes) {
        let turns = this.gameView.salvoes[gpid];
        for (const turn in turns) {
          let salvoLocations = turns[turn];
          salvoLocations.forEach(salvoLocation => {
            if (gpid == this.gpID) {
              document
                .getElementById(salvoLocation + "y")
                .classList.add("salvo");
              document.getElementById(salvoLocation + "y").innerHTML = turn;
            }
            if (gpid != this.gpID) {
              document
                .getElementById(salvoLocation + "m")
                .classList.add("salvo");
              document.getElementById(salvoLocation + "m").innerHTML = turn;
            }
            if (
              document.getElementById(salvoLocation + "m").classList.length > 2
            ) {
              document.getElementById(salvoLocation + "m").classList.add("hit");
            }
          });
        }
      }
    },
    printOpponentSalvoes() {
      for (let location in this.gameView.battleStatus.hitsReceived) {
        document
          .getElementById(
            this.gameView.battleStatus.hitsReceived[location] + "y"
          )
          .classList.add("hit");
      }
      for (let location in this.gameView.battleStatus.missReceived) {
        document
          .getElementById(
            this.gameView.battleStatus.missReceived[location] + "y"
          )
          .classList.add("salvo");
      }
    },
    markSunkShips() {
      this.gameView.battleStatus.fleetStatus.forEach(ship => {
        if (ship.isSunk == true && ship.shipType == "Patrol Boat") {
          document.getElementById("enemyShip1").style.backgroundColor = "red";
        }
        if (ship.isSunk == true && ship.shipType == "Destroyer") {
          document.getElementById("enemyShip2").style.backgroundColor = "red";
        }
        if (ship.isSunk == true && ship.shipType == "Submarine") {
          document.getElementById("enemyShip3").style.backgroundColor = "red";
        }
        if (ship.isSunk == true && ship.shipType == "Battleship") {
          document.getElementById("enemyShip4").style.backgroundColor = "red";
        }
        if (ship.isSunk == true && ship.shipType == "Carrier") {
          document.getElementById("enemyShip5").style.backgroundColor = "red";
        }
      });
    }
  },
  watch: {
    gameView() {
      setTimeout(() => {
        this.printShips();
        this.printSalvoes();
        if (this.gameView.hasOwnProperty("battleStatus")) {
          this.printOpponentSalvoes();
          this.markSunkShips();
        }
      }, 1);
    },
    status() {
      if (this.status.includes("Waiting")) {
        this.interval = setInterval(() => {
          //console.log("calling");
          this.getGVdata();
        }, 3000);
      } else {
        clearInterval(this.interval);
      }
    },
    errors() {
      setTimeout(() => {
        this.errors = null;
      }, 3000);
    },
    successes() {
      setTimeout(() => {
        this.successes = null;
      }, 3000);
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
    //console.log("destroy");
  },
  created() {
    this.getGVdata();
  }
};
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: auto auto auto auto auto auto auto auto auto auto;
  padding: 20px;
  width: auto;
}
.grid-item {
  border: 1px solid;
  padding: 20px;
  text-align: center;
  width: 50px;
  height: 50px;
  font-size: 12px;
  font-weight: bold;
  position: relative;
}
.ship1 {
  width: 50px;
  height: 100px;
  position: relative;
  background-color: grey;
}
.ship2 {
  width: 50px;
  height: 150px;
  position: relative;
  background-color: grey;
}
.ship3 {
  width: 50px;
  height: 150px;
  position: relative;
  background-color: grey;
}
.ship4 {
  width: 50px;
  height: 200px;
  position: relative;
  background-color: grey;
}
.ship5 {
  width: 50px;
  height: 250px;
  position: relative;
  background-color: grey;
}
.ship1h {
  width: 100px;
  height: 50px;
  background-color: grey;
}
.ship2h {
  width: 150px;
  height: 50px;
  background-color: grey;
}
.ship3h {
  width: 150px;
  height: 50px;
  background-color: grey;
}
.ship4h {
  width: 200px;
  height: 50px;
  background-color: grey;
}
.ship5h {
  width: 250px;
  height: 50px;
  background-color: grey;
}
.flexgrids {
  display: flex;
  justify-content: space-around;
}
.ship {
  background-color: grey;
  position: absolute;
  top: 0;
  left: 0;
}
.shipBackend {
  background-color: grey;
}
.rotationButton {
  z-index: 9999;
  position: absolute;
  top: 0;
  left: 0;
}
.salvo {
  background-color: blue;
}
.hit {
  background-color: red;
}
button {
  border: solid;
  border-width: 1px;
  border-color: black;
}
.shipContainer {
  position: relative;
}
</style>