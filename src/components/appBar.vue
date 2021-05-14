<template>
  <v-app-bar app color="primary" dark dense>
    <v-app-bar-title> Todos </v-app-bar-title>
    <v-spacer />
    <v-menu offset-y v-if="user">
      <template v-slot:activator="{ on, attrs }">
        <v-btn text dark v-bind="attrs" v-on="on">
          <v-icon left dark> mdi-account </v-icon>{{ user.name }}
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item @click="logOut">
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "AppBar",
  computed: {
    ...mapGetters(["user"]),
  },
  methods: {
    ...mapMutations(["logOut"]),
  },
};
</script>

<style></style>
