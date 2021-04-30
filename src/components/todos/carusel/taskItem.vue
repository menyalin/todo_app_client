<template>
  <div class="row-wrapper">
    <div v-if="isEditable" class="item-row">
      <div class="px-1">
        <v-icon small color="error"> mdi-pencil </v-icon>
      </div>

      <input
        ref="task_input"
        @keyup.enter="saveItem"
        @blur="cancelEditItem"
        @keyup.esc="cancelEditItem"
        class="task-input"
        :value="inputValue"
      />
    </div>
    <div
      v-else
      class="item-row"
      @mouseenter="showBtn = true"
      @mouseleave="showBtn = false"
    >
      <div
        class="px-1"
        @click.exact="completeTask"
        :style="{
          cursor: 'pointer',
        }"
      >
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
              'content-hover': hover && !task.completed,
            }"
            ref="content_text"
            @dblclick="openForm"
            @click.ctrl="editItem"
            @mouseenter="contentHover"
            @mouseleave="closeTooltip"
          >
            <div></div>
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
import { mapActions, mapMutations } from "vuex";
export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      timeoutId: null,
      tooltipDelay: 300,
      showBtn: false,
      isEditable: false,
      inputValue: "",
      showTooltip: false,
      hover: false,
    };
  },
  methods: {
    ...mapActions(["updateTaskContent", "changeTaskStatus", "removeTask"]),
    ...mapMutations(["openTaskForm"]),
    editItem() {
      this.inputValue = this.task.content;
      this.isEditable = true;
      this.$nextTick(() => {
        this.$refs.task_input.focus();
      });
    },
    openForm() {
      this.openTaskForm();
    },
    contentHover() {
      const el = this.$refs.content_text;
      this.hover = true;
      if (el.offsetWidth < el.scrollWidth) {
        this.timeoutId = setTimeout(() => {
          this.$nextTick(() => {
            this.showTooltip = true;
          });
        }, this.tooltipDelay);
      }
    },
    closeTooltip() {
      this.hover = false;
      this.showTooltip = false;
      clearTimeout(this.timeoutId);
    },
    completeTask() {
      this.$nextTick(() => {
        this.changeTaskStatus({
          taskId: this.task.id,
          status: !this.task.completed,
        });
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
};
</script>
<style scoped>
.tooltip-content {
  max-width: 400px;
  z-index: 10;
}
.task-input {
  width: 100%;
  height: 100%;
  font-size: 0.9rem;
  appearance: none;
  outline: 0;
  box-shadow: none;
  vertical-align: bottom;
}
.item-row {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  width: 100%;
  height: 100%;
}
.content {
  transition: all ease-in-out 0.3s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.9rem;
  flex: 1 1 100%;

  vertical-align: bottom;
}
.content-hover {
  font-weight: 600;
}
.btn-wrapper {
  width: 1.8rem;
}
.row-wrapper {
  overflow: hidden;
  width: 100%;
  height: 100%;
}
.completed {
  opacity: 0.4;
}
</style>
