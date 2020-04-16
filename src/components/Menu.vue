<template>
  <nav>
    <ul>
      <li>
        <router-link to="/">Home</router-link>
      </li>
      <li v-if="!getCurrentUser">
        <router-link to="/signup">Sign up</router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["getCurrentUser"])
  }
};
</script>

<style>
</style>