<template>
  <v-app-bar app color="primary" dark dense>
    <v-app-bar-title> Todos </v-app-bar-title>
    <v-spacer />
    <v-btn text @click="logOut">Logout</v-btn>
  </v-app-bar>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  name: "AppBar",
  methods: {
    ...mapMutations(["logOut"]),
  },
};
</script>

<style></style>
