<template>
  <div class="todos-row">
    <div class="control-column">
      <side-panel>
        <v-btn
          @click="shiftDate({ count: -1, slides: slidesOnScreen })"
          icon
          color="primary"
        >
          <v-icon x-large> mdi-arrow-left-bold-circle </v-icon>
        </v-btn>
        <v-btn
          @click="shiftDate({ count: -slidesOnScreen, slides: slidesOnScreen })"
          icon
        >
          <v-icon> mdi-chevron-double-left </v-icon>
        </v-btn>
        <v-btn @click="resetCurrentDate" icon>
          <v-icon> mdi-home </v-icon>
        </v-btn>
        el: {{ slidesOnScreen }} <br />
      </side-panel>
    </div>

    <div :style="{ 'z-index': '0' }" ref="carusel_wrapper">
      <app-carusel
        :items="todosDays"
        :direction="slideDirection"
        :slideCount="slidesOnScreen"
        :caruselWidth="caruselWidth"
      />
    </div>

    <div class="control-column">
      <side-panel>
        <v-btn
          @click="shiftDate({ count: 1, slides: slidesOnScreen })"
          icon
          color="primary"
        >
          <v-icon x-large> mdi-arrow-right-bold-circle </v-icon>
        </v-btn>
        <v-btn
          @click="shiftDate({ count: slidesOnScreen, slides: slidesOnScreen })"
          icon
        >
          <v-icon> mdi-chevron-double-right </v-icon>
        </v-btn>
        <app-date-selector @changeCurrentDate="changeCurrentDate" />
      </side-panel>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import sidePanel from "./sidePanel.vue";

import appDateSelector from "./dateSelector";
import appCarusel from "./carusel";

export default {
  components: { sidePanel, appCarusel, appDateSelector },
  name: "Todos_layout",
  data() {
    return {
      caruselEl: null,
      caruselWidth: null,
    };
  },
  computed: {
    ...mapGetters(["todosDays", "slideDirection"]),
    slidesOnScreen() {
      let width = this.caruselWidth;
      switch (true) {
        case width < 650:
          return 3;
        case width < 1100:
          return 4;
        case width < 1400:
          return 5;
        case width < 1600:
          return 6;
        case width < 1800:
          return 7;
        default:
          return 7;
      }
    },
  },
  mounted() {
    window.addEventListener("resize", this.resizeCarusel);
    this.caruselEl = this.$refs.carusel_wrapper;
    this.resizeCarusel();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeCarusel);
  },
  methods: {
    ...mapMutations(["shiftDate", "setDate"]),
    changeCurrentDate(newDate) {
      this.setDate({ newDate, slides: this.slidesOnScreen });
    },
    resizeCarusel() {
      this.caruselWidth = this.caruselEl.offsetWidth;
      this.$store.dispatch("initTodoDays", this.slidesOnScreen);
    },
    resetCurrentDate() {
      this.setDate({ newDate: "", slides: this.slidesOnScreen });
    },
  },
};
</script>

<style>
.todos-row {
  display: grid;
  grid-template-columns: 65px 1fr 65px;
  grid-template-rows: 1fr;
}
.control-column {
  background-color: white;
  z-index: 2;
}
</style>
