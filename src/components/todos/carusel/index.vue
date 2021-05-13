<template>
  <div class="todos-wrapper" :style="todosWrapperStyles">
    <transition-group
      class="todos"
      name="todos"
      :enter-class="slideDirection"
      tag="div"
      :style="caruselStyles"
    >
      <div v-for="day in days" :key="day.date" class="item" :style="itemStyles">
        <app-day :date="day.date" />
      </div>
    </transition-group>
  </div>
</template>
<script>
import appDay from "./day";
export default {
  props: ["days", "direction", "slideCount", "caruselWidth"],
  components: {
    appDay,
  },
  computed: {
    slideDirection() {
      return `todos-enter-${this.direction}`;
    },
    itemWidth() {
      return this.caruselWidth / (this.slideCount - 2);
    },
    itemStyles() {
      return {
        width: this.itemWidth + "px",
      };
    },
    todosWrapperStyles() {
      return {
        width: this.caruselWidth + "px",
      };
    },
    caruselStyles() {
      return {
        "margin-left": "-" + this.itemWidth + "px",
        "margin-right": "-" + this.itemWidth + "px",
        width: this.caruselWidth + this.itemWidth * 2 + "px",
      };
    },
  },
};
</script>
<style scoped>
.todos-wrapper {
  overflow: hidden;
  height: 100%;
}
.todos {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
}
.todos-move {
  transition: transform 0.7s;
}
.todos-leave {
  display: none;
  position: absolute;
}

.todos-leave-to {
  display: none;
  position: absolute;
}
.todos-enter-right {
  opacity: 0.7;
  transform: translateX(100%);
}
.todos-enter-left {
  opacity: 0.7;
  transform: translateX(-100%);
}
.todos-enter-to {
  opacity: 1;
}
.todos-enter-active,
.todos-leave-active {
  transition: transform cubic-bezier(0.2, 0.7, 0.25, 1) 0.7s;
}
</style>
