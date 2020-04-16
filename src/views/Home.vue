<template>
  <div>
    <LogIn></LogIn>
    <Games></Games>
  </div>
</template>

<script>
import Games from "./Games";
import LogIn from "../components/LogIn";

export default {
  components: {
    LogIn,
    Games
  }
};
</script>

<style scoped></style>