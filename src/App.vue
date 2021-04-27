<template>
  <v-app>
    <app-bar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import appBar from "./components/appBar";

export default {
  name: "App",
  components: {
    appBar,
  },
};
</script>
