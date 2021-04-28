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
      <div class="px-1">
        <v-icon small color="primary" v-if="task.completed">
          mdi-check-circle
        </v-icon>
        <v-icon small color="primary" v-else>
          mdi-checkbox-blank-circle-outline
        </v-icon>
      </div>

      <v-tooltip bottom v-model="showTooltip">
        <template v-slot:activator="{ attrs }">
          <div
            v-bind="attrs"
            class="content"
            :class="{
              completed: task.completed,
            }"
            ref="content_text"
            @mouseenter="contentHover"
            @mouseleave="closeTooltip"
          >
            {{ task.content }}
          </div>
        </template>
        <div class="tooltip-content">{{ task.content }}</div>
      </v-tooltip>

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
      showTooltip: false,
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
    contentHover() {
      const el = this.$refs.content_text;
      if (el.offsetWidth < el.scrollWidth) {
        this.showTooltip = true;
      }
    },
    closeTooltip() {
      this.showTooltip = false;
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
.tooltip-content {
  max-width: 400px;
  white-space: pre-wrap;
}
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
  /* Многоточие */
  font-size: 0.9rem;
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
