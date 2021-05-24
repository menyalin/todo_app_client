/* eslint-disable no-unused-vars */
<template>
  <div class="todos-row" :style="rowStyles">
    <!-- left bar -->
    <div class="control_bar">
      <side-panel>
        <v-btn @click="leftShift" icon color="primary">
          <v-icon x-large> mdi-arrow-left-bold-circle </v-icon>
        </v-btn>
        <v-btn icon @click="leftShiftByStep">
          <v-icon> mdi-arrow-collapse-left </v-icon>
        </v-btn>
        <v-btn @click="initSlides" icon>
          <v-icon> mdi-home </v-icon>
        </v-btn>
      </side-panel>
    </div>

    <transition-group
      name="carusel"
      tag="div"
      class="carusel_container"
      ref="carusel_el"
      :style="caruselContainerStyles"
    >
      <div
        class="slide"
        v-for="(slide, idx) of slides"
        :key="slide.format(dateFormat)"
        :style="slideStyles(idx)"
        :ref="slide.format(dateFormat)"
      >
        <app-day :date="slide.format(dateFormat)" />
      </div>
    </transition-group>
    <!-- right bar -->
    <div class="control_bar">
      <side-panel>
        <v-btn @click="rightShift" icon color="primary">
          <v-icon x-large> mdi-arrow-right-bold-circle </v-icon>
        </v-btn>
        <v-btn icon @click="rightShiftByStep">
          <v-icon> mdi-arrow-collapse-right </v-icon>
        </v-btn>
        <app-date-selector
          @changeCurrentDate="initSlides"
          :date="baseDate.format(dateFormat)"
        />
      </side-panel>
      <app-task-form />
    </div>
  </div>
</template>
<script>
import moment from "moment";
import appDateSelector from "../todos/dateSelector.vue";
import sidePanel from "./sidePanel";
import appTaskForm from "./taskForm";
import appDay from "./day";
import { mapGetters } from "vuex";

export default {
  components: { appDateSelector, sidePanel, appTaskForm, appDay },
  name: "carusel",
  data() {
    return {
      baseDate: null,
      caruselWidth: null,
      shift: 0,
      slidesCount: 30,
      leftSideHiddenSlides: 10,
      slides: [],
      dateFormat: "YYYY-MM-DD",
    };
  },
  created() {
    this.initSlides();
  },
  computed: {
    ...mapGetters(["getDayTasks", "isFormOfTaskVisible"]),
    visibleSlides() {
      const startPos = this.isNeedShiftSlide
        ? this.leftSideHiddenSlides - 1
        : this.leftSideHiddenSlides;
      return this.slides
        .slice(startPos, startPos + this.slidesOnScreen)
        .map((slide) => slide.format(this.dateFormat));
    },
    caruselContainerStyles() {
      return {
        width: this.caruselWidth + "px",
      };
    },
    slideWidth() {
      return this.caruselWidth / this.slidesOnScreen;
    },
    slidesOnScreen() {
      let width = this.caruselWidth;
      switch (true) {
        case width < 650:
          return 1;
        case width < 1100:
          return 2;
        case width < 1400:
          return 3;
        case width < 1600:
          return 4;
        case width < 2000:
          return 5;
        default:
          return 6;
      }
    },
    isNeedShiftSlide() {
      return this.slidesOnScreen > 3;
    },
    slideShift() {
      if (!this.isNeedShiftSlide) return 0;
      else return this.slideWidth;
    },
    maxSlideHeight() {
      const res = this.visibleSlides.map((slideDate) => {
        return this.getDayTasks(slideDate).length;
      });
      return 190 + Math.max(...res) * 30;
    },
    rowStyles() {
      return {
        height: this.maxSlideHeight + "px",
        "min-height": "550px",
      };
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeCarusel);
    window.removeEventListener("keydown", this.arrowKeyHandler);
  },
  mounted() {
    window.addEventListener("resize", this.resizeCarusel);
    this.resizeCarusel();
    window.addEventListener("keydown", this.arrowKeyHandler);
  },
  methods: {
    initSlides(inputDate) {
      let date = null;
      if (
        !!inputDate &&
        typeof inputDate === "string" &&
        moment(inputDate).isValid()
      ) {
        this.baseDate = moment(inputDate);
        date = inputDate;
      } else {
        date = moment().format(this.dateFormat);
        this.baseDate = moment();
      }
      this.slides = [];
      for (let i = -this.leftSideHiddenSlides; i < this.slidesCount; i++) {
        this.slides.push(moment(date).add(i, "d"));
      }
    },
    resizeCarusel() {
      this.caruselWidth = window.innerWidth - 107;
    },
    arrowKeyHandler(e) {
      if (e.code === "ArrowLeft" && !this.isFormOfTaskVisible) {
        this.leftShift();
      }
      if (e.code === "ArrowRight" && !this.isFormOfTaskVisible) {
        this.rightShift();
      }
    },
    slideStyles(i) {
      return {
        width: this.slideWidth + "px",
        left:
          (i - this.leftSideHiddenSlides) * this.slideWidth +
          this.slideShift +
          "px",
      };
    },
    leftShiftByStep() {
      for (let i = 0; i < this.slidesOnScreen; i++) {
        this.$nextTick(() => {
          this.leftShift();
        });
      }
    },
    rightShiftByStep() {
      for (let i = 0; i < this.slidesOnScreen; i++) {
        this.$nextTick(() => {
          this.rightShift();
        });
      }
    },
    leftShift() {
      this.baseDate.add(-1, "d");
      const firstDay = moment(this.slides[0].format(this.dateFormat)).add(
        -1,
        "d"
      );
      this.slides.unshift(firstDay);
      this.slides.pop();
    },
    rightShift() {
      this.baseDate.add(1, "d");
      const lastDay = moment(
        this.slides[this.slides.length - 1].format(this.dateFormat)
      ).add(1, "d");
      this.slides.push(lastDay);
      this.slides.shift();
    },
  },
};
</script>
<style>
.todos-row {
  display: grid;
  grid-template-columns: 45px 1fr 45px;
}
.carusel-move {
  transition: transform 0.5s;
}
.carusel-enter-active {
  transition: opacity 2s;
}
.carusel-enter,
.carusel-leave-to {
  opacity: 0;
}
.carusel_container {
  margin: 0 auto;
  overflow: clip;
  position: relative;
  height: 100%;
}
.slide {
  position: absolute;
  box-sizing: border-box;
  height: 100%;
}
</style>
