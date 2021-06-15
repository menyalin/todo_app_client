<template>
  <div :class="{ 'day-wrapper': true, today: isToday, 'gone-days': isGoneDay }">
    <header ref="header">
      <div class="display-2 text-center mt-2 pt-5 pb-2">
        {{ momentDate.format("dddd") }}
      </div>
      <div color="primary" class="subtitle text-center pb-4">
        {{ momentDate.format("DD MMMM YYYY") }}
      </div>
      <v-divider horizontal />
    </header>
    <div class="main-section">
      <div class="pa-0">
        <transition-group name="list" tag="div" class="list">
          <div
            v-for="task in dayTasks"
            :key="task._id"
            draggable
            @dragstart="dragstartHandler($event, task._id, date)"
            @drop.prevent="dropHandler(date)"
            @dragend="dragendHandler"
            @dragenter.stop.prevent="dragoverItemHandler($event, date, task)"
            @dragover.prevent
            :order="task.order"
            class="pa-0 list-item"
            :class="{
              selected: task._id === moveableTaskId,
            }"
          >
            <app-task-item :task="task" />
          </div>
        </transition-group>

        <div
          @dragenter.prevent="dragoverContainerHandler($event, date)"
          @dragover.prevent
          class="list-item"
        >
          <input
            ref="new_task_input"
            @keydown.left.stop
            @keydown.right.stop
            @change="addTaskHandler"
            @keyup.esc="cancelEditItem"
            class="task-input"
            :value="editableTask"
          />
        </div>
      </div>
      <div
        class="todo-empty-list"
        @dragenter.prevent="dragoverContainerHandler($event, date)"
        @dragover.prevent
        @click="setFocus"
      />
    </div>
  </div>
</template>
<script>
import moment from "moment";
import { mapActions, mapGetters, mapMutations } from "vuex";
import appTaskItem from "./taskItem";

export default {
  name: "day",
  components: {
    appTaskItem,
  },
  data() {
    return {
      editableTask: "",
    };
  },
  props: {
    date: {
      type: String,
      required: true,
    },
  },
  methods: {
    ...mapMutations(["setMoveableTaskId"]),
    ...mapActions([
      "addTask",
      "updateTask",
      "reorderTaskInDay",
      "updateDayTasks",
    ]),
    cancelEditItem() {
      this.editableTask = "";
    },
    setFocus() {
      this.$refs.new_task_input.focus();
    },
    addTaskHandler(e) {
      if (e.target.value.trim()) {
        this.addTask({ content: e.target.value.trim(), date: this.date });
        this.editableTask = "";
      }
      this.$nextTick(() => {
        this.$refs.new_task_input.blur();
      });
    },

    dragstartHandler(e, _id, date) {
      this.setMoveableTaskId(_id);
      e.target.classList.add("selected");
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.dropEffect = "move";

      e.dataTransfer.setData("task", JSON.stringify({ date, _id }));
    },

    dragendHandler(e) {
      this.setMoveableTaskId(null);
      e.target.classList.remove("selected");
    },

    dragoverContainerHandler(e, date) {
      this.updateTask({ _id: this.moveableTaskId, date, toBottom: true });
    },
    // eslint-disable-next-line no-unused-vars
    dragoverItemHandler(e, date, task) {
      if (this.moveableTaskId === task._id) {
        return;
      }
      this.reorderTaskInDay({
        targetDate: date,
        taskId: this.moveableTaskId,
        targetOrder: task.order,
      });
    },
    dropHandler(date) {
      this.updateDayTasks({ date });
    },
  },
  computed: {
    ...mapGetters(["moveableTaskId"]),
    dayTasks() {
      return this.$store.getters.getDayTasks(this.date);
    },
    today() {
      return moment();
    },
    momentDate() {
      return moment(this.date);
    },
    isToday() {
      return this.momentDate.isSame(this.today, "day");
    },
    isGoneDay() {
      return this.momentDate.isBefore(this.today, "day");
    },
  },
};
</script>
<style scoped>
.task-input {
  width: 100%;
  height: 100%;
  appearance: none;
  outline: 0;
  box-shadow: none;
}
.list-move {
  transition: transform 0.2s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
}
.list-enter-to,
.list-leave {
  opacity: 1;
}
.list-enter-active,
.list-leave-active {
  transition: opacity 0.3s;
}
.selected {
  opacity: 0.4;
  /* border: 1px black dotted;
  border-radius: 7px; */
}
.day-wrapper {
  display: flex;
  padding: 3px;
  flex-direction: column;
  height: 100%;
}
.list {
  display: flex;
  flex-direction: column;
}
.today {
  color: darkblue;
}
.gone-days {
  color: grey;
  font-weight: 300;
}
.list-item {
  height: 30px;
  padding: 0;
  overflow-y: hidden;
  box-sizing: border-box;
  cursor: grab;
}
.main-section {
  height: 100%;
  background-image: repeating-linear-gradient(
    #ffffff 0px,
    #ffffff 29px,
    rgba(0, 0, 0, 0.15) 30px
  );
}
.todo-empty-list {
  height: 100%;
}
.draggableZone {
  height: 100%;
}
</style>
