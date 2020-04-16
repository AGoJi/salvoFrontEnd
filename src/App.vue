<template>
  <v-app>
    <h1>Salvo!</h1>
    <Menu></Menu>
    <router-view></router-view>
  </v-app>
</template>

<script>
import Menu from "./components/Menu";
export default {
  components: {
    Menu
  }
};
</script>
