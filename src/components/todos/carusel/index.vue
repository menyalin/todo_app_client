<template>
  <div class="todos-wrapper">
    <transition-group
      class="todos"
      name="todos"
      :enter-class="slideDirection"
      tag="div"
      :style="caruselStyles"
    >
      <div
        v-for="item in items"
        :key="item.date"
        class="item"
        :style="itemStyles"
      >
        <app-day :date="item.date" />
      </div>
    </transition-group>
  </div>
</template>
<script>
import appDay from "./day";
export default {
  props: ["items", "direction", "slideCount", "caruselWidth"],
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
    caruselStyles() {
      return {
        "margin-left": "-" + this.itemWidth + "px",
        "margin-right": "-" + this.itemWidth + "px",
        // width: this.caruselWidth + this.itemWidth * 2 + "px",
      };
    },
  },
};
</script>
<style scoped>
.todos-wrapper {
  overflow: hidden;
}
.todos {
  display: flex;
  flex-wrap: nowrap;
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
  transform: translateX(200%);
}
.todos-enter-left {
  opacity: 0.7;
  transform: translateX(-200%);
}
.todos-enter-to {
  opacity: 1;
}
.todos-enter-active,
.todos-leave-active {
  transition: transform cubic-bezier(0.2, 0.7, 0.25, 1) 0.7s;
}
</style>
