<template>
  <v-dialog
    v-model="isFormOfTaskVisible"
    persistent
    @click:outside="outsideClick"
    @keydown.esc="pressEsc"
    max-width="800"
  >
    <v-card>
      <v-card-title class="pb-6"> Edit task</v-card-title>
      <v-card-text>
        <v-textarea outlined hide-details label="Content" v-model="content" />
        <v-checkbox label="Completed" v-model="completed" />
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="green darken-1" text @click="cancelHandler">
          Cancel
        </v-btn>

        <v-btn
          color="green darken-1"
          text
          @click="saveHandler"
          :disabled="submitDisabled"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  name: "taskForm",
  data() {
    return {
      dialog: true,
      id: null,
      content: null,
      completed: null,
      oldTask: null,
    };
  },
  watch: {
    editableTaskId: function (id) {
      if (id) {
        this.setFields(id);
      } else {
        this.resetFields();
      }
    },
  },
  computed: {
    ...mapGetters(["isFormOfTaskVisible", "editableTaskId", "taskById"]),
    submitDisabled() {
      if (!this.id) return true;
      if (
        this.completed !== this.oldTask.completed ||
        this.content !== this.oldTask.content
      ) {
        return false;
      } else return true;
    },
  },

  methods: {
    ...mapActions(["updateTask"]),
    setFields(taskId) {
      this.oldTask = this.taskById(taskId);
      this.id = this.oldTask.id;
      this.content = this.oldTask.content;
      this.completed = this.oldTask.completed;
    },
    resetFields() {
      this.id = null;
      this.content = null;
      this.completed = null;
    },
    ...mapMutations(["closeTaskForm"]),
    cancelHandler() {
      this.closeTaskForm();
    },
    saveHandler() {
      this.updateTask({
        id: this.id,
        content: this.content,
        completed: this.completed,
      });
    },
    outsideClick() {
      this.closeTaskForm();
    },
    pressEsc() {
      this.closeTaskForm();
    },
  },
};
</script>
<style></style>
