<template>
  <div class="row-wrapper" @mouseleave="hover = false">
    <div v-if="isEditable" class="item-row">
      <div class="px-1">
        <v-icon small color="error"> mdi-pencil </v-icon>
      </div>
      <input
        ref="task_input"
        @keyup.enter="saveItem"
        @blur="cancelEditItem"
        @keyup.esc="cancelEditItem"
        @keydown.left.stop
        @keydown.right.stop
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
          mdi-radiobox-marked
        </v-icon>
        <v-icon small color="primary" v-else> mdi-radiobox-blank </v-icon>
      </div>
      <v-tooltip bottom v-model="showTooltip">
        <template v-slot:activator="{ on, attr }">
          <div
            v-bind="on"
            v-on="attr"
            :class="{
              content: true,
              completed: task.completed,
              'content-hover': hover && !task.completed,
            }"
            ref="content_text"
            @dblclick="openForm"
            @click.ctrl="editItem"
            @mouseenter="contentMouseEnter"
            @mouseleave="contentMouseLeave"
          >
            {{ task.content }}
          </div>
        </template>
        <div>
          {{ task.content }}
        </div>
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
      showBtn: false,
      isEditable: false,
      inputValue: "",
      showTooltip: false,
      hover: false,
    };
  },
  methods: {
    ...mapActions(["updateTask", "changeTaskStatus", "removeTask"]),
    ...mapMutations(["openTaskForm"]),
    editItem() {
      this.inputValue = this.task.content;
      this.isEditable = true;
      this.$nextTick(() => {
        this.$refs.task_input.focus();
      });
    },
    openForm() {
      this.openTaskForm(this.task._id);
    },
    setTooltipShow() {
      const el = this.$refs.content_text;
      if (el.offsetWidth < el.scrollWidth) {
        this.showTooltip = true;
      } else this.showTooltip = false;
    },
    contentMouseEnter() {
      this.hover = true;
      this.setTooltipShow();
    },
    contentMouseLeave() {
      this.showTooltip = false;
    },
    completeTask() {
      this.$nextTick(() => {
        this.updateTask({
          _id: this.task._id,
          completed: !this.task.completed,
          date: this.task.date,
        });
      });
    },
    removeHandler() {
      this.removeTask(this.task._id);
    },
    cancelEditItem() {
      this.isEditable = false;
    },
    saveItem(e) {
      this.isEditable = false;
      this.updateTask({
        _id: this.task._id,
        content: e.target.value,
      });
    },
  },
};
</script>
<style scoped>
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
  /* transition: all ease-in-out 0.3s; */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.9rem;
  flex: 1 1 100%;
  vertical-align: bottom;
}
.content-hover {
  font-weight: 500;
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
  opacity: 0.5;
}
</style>
