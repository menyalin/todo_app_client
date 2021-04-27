<template>
  <div class="row-wrapper">
    <div v-if="isEditable">
      <input
        ref="task_input"
        @keyup.enter="saveItem"
        @blur="cancelEditItem"
        @keyup.esc="cancelEditItem"
        class="task-input"
        :value="inputValue"
        autofocus
      />
    </div>
    <div
      v-else
      @dblclick="editItem"
      class="item-row"
      @click="completeTask"
      @mouseenter="showBtn = true"
      @mouseleave="showBtn = false"
    >
      <div
        class="px-1"
        :class="{
          completed: task.completed,
        }"
      >
        <v-icon color="primary" v-if="task.completed">
          mdi-check-circle
        </v-icon>
        <v-icon color="primary" v-else>
          mdi-checkbox-blank-circle-outline
        </v-icon>
      </div>
      <div
        class="content"
        :class="{
          completed: task.completed,
        }"
      >
        {{ task.content }}
      </div>

      <div class="btn-wrapper">
        <v-icon
          v-show="showBtn"
          @click.stop="removeHandler"
          small
          color="error"
          :style="{ cursor: 'pointer' }"
        >
          mdi-delete
        </v-icon>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      showBtn: false,
      isEditable: false,
      inputValue: "",
    };
  },
  methods: {
    ...mapActions(["updateTaskContent", "changeTaskStatus", "removeTask"]),
    editItem() {
      this.inputValue = this.task.content;
      this.isEditable = true;
      this.$nextTick(() => {
        this.$refs.task_input.focus();
      });
    },
    completeTask() {
      this.changeTaskStatus({
        taskId: this.task.id,
        status: !this.task.completed,
      });
    },
    removeHandler() {
      this.removeTask(this.task.id);
    },
    cancelEditItem() {
      this.isEditable = false;
    },
    saveItem(e) {
      this.isEditable = false;
      this.updateTaskContent({
        id: this.task.id,
        content: e.target.value,
      });
    },
  },
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
};
</script>
<style scoped>
.task-input {
  width: 100%;
  appearance: none;
  outline: 0;
  box-shadow: none;
}
.item-row {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  align-content: center;
  width: 100%;
}
.content {
  transition: all ease-in-out 0.3s;
  white-space: nowrap; /* Отменяем перенос текста */
  overflow: hidden; /* Обрезаем содержимое */
  text-overflow: ellipsis; /* Многоточие */
  font-size: 0.9rem;
  flex: 1 1 100%;
}
.content :hover {
  position: absolute;
  white-space: wrap; /* Отменяем перенос текста */
  overflow: hidden; /* Обрезаем содержимое */
  /* Многоточие */
  font-size: 0.9rem;
  flex: 1 1 100%;
}
.btn-wrapper {
  width: 1.8rem;
}
.row-wrapper {
  overflow: hidden;
  width: 100%;
}
.completed {
  opacity: 0.4;
}
</style>
