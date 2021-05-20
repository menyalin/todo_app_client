/* eslint-disable no-unused-vars */
<template>
  <div>
    <div class="todos-row">
      <!-- left bar -->
      <div class="control_bar">
        <side-panel>
          <v-btn @click="leftShift" icon color="primary">
            <v-icon x-large> mdi-arrow-left-bold-circle </v-icon>
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
          v-for="slide of slides"
          :key="slide.date.format(dateFormat)"
          :style="slideStyles(slide.index)"
        >
          <app-day :date="slide.date.format(dateFormat)" />
        </div>
      </transition-group>
      <!-- right bar -->
      <div class="control_bar">
        <side-panel>
          <v-btn @click="rightShift" icon color="primary">
            <v-icon x-large> mdi-arrow-right-bold-circle </v-icon>
          </v-btn>
          <app-date-selector
            @changeCurrentDate="initSlides"
            :date="baseDate.format(dateFormat)"
          />
        </side-panel>
        <app-task-form />
      </div>
    </div>
    <div>
      Служебная информация: {{ visibleSlides }}
      <br />
      BaseDate: {{ baseDate.format(dateFormat) }}
    </div>
  </div>
</template>
<script>
import moment from "moment";
import appDateSelector from "../todos/dateSelector.vue";
import sidePanel from "./sidePanel";
import appTaskForm from "./taskForm";
import appDay from "./day";

export default {
  components: { appDateSelector, sidePanel, appTaskForm, appDay },
  name: "carusel",
  data() {
    return {
      baseDate: null,
      caruselWidth: null,
      shift: 0,
      slidesCount: 20,
      leftSideHiddenSlides: 10,
      slides: [],
      dateFormat: "YYYY-MM-DD",
    };
  },
  created() {
    this.initSlides();
  },
  computed: {
    visibleSlides() {
      const startPos = this.isNeedShiftSlide
        ? this.leftSideHiddenSlides - 1
        : this.leftSideHiddenSlides - 1;
      return this.slides
        .slice(startPos, startPos + this.slidesOnScreen)
        .map((slide) => slide.date.format(this.dateFormat));
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
      this.shift = this.slideShift;
      for (let i = -this.leftSideHiddenSlides; i < this.slidesCount; i++) {
        this.slides.push({
          date: moment(date).add(i, "d"),
          index: i,
        });
      }
    },
    resizeCarusel() {
      this.caruselWidth = window.innerWidth - 147;
      this.baseDate = moment();
      this.shift = this.slideShift;
    },
    arrowKeyHandler(e) {
      if (e.code === "ArrowLeft") {
        this.leftShift();
      }
      if (e.code === "ArrowRight") {
        this.rightShift();
      }
    },
    slideStyles(i) {
      return {
        width: this.slideWidth + "px",
        left: i * this.slideWidth + this.shift + "px",
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
      const firstDay = moment(this.slides[0].date.format(this.dateFormat)).add(
        -1,
        "d"
      );
      const firstIndex = this.slides[0].index;
      this.slides.unshift({ date: firstDay, index: firstIndex - 1 });
      this.shift += this.slideWidth;
      this.slides.pop();
    },
    rightShift() {
      this.baseDate.add(1, "d");
      const lastDay = moment(
        this.slides[this.slides.length - 1].date.format(this.dateFormat)
      ).add(1, "d");
      const lastIndex = this.slides[this.slides.length - 1].index;
      this.slides.push({
        date: lastDay,
        index: lastIndex + 1,
      });
      this.shift -= this.slideWidth;
      this.slides.shift();
    },
  },
};
</script>
<style>
.todos-row {
  display: grid;
  grid-template-columns: 55px 1fr 55px;
  grid-template-rows: 1fr;
}
.carusel-move {
  transition: transform 0.5s;
}
.carusel_container {
  background-color: blanchedalmond;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  min-height: 600px;
}
.slide {
  position: absolute;
  height: 100%;
  box-sizing: border-box;
}
</style>
