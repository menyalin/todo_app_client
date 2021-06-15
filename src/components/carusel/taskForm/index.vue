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
        <div>
          <v-menu
            v-model="dateMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                :value="date"
                label="Task date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              no-title
              @input="dateMenu = false"
            ></v-date-picker>
          </v-menu>
        </div>
        <v-textarea outlined hide-details label="Content" v-model="content" />
        <v-checkbox label="Completed" v-model="completed" />
        <v-select label="Repeat task" :items="repeatItems" v-model="repeat" />
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
      dateMenu: false,
      dialog: true,
      id: null,
      content: null,
      completed: null,
      oldTask: null,
      date: null,
      endDate: null,
      repeat: "none",
      repeatItems: [
        {
          text: "Never",
          value: "none",
        },
        {
          text: "Every day",
          value: "days",
        },
        {
          text: "Every week",
          value: "weeks",
        },
        {
          text: "Every month",
          value: "months",
        },
        {
          text: "Every month",
          value: "months",
        },
        {
          text: "Every year",
          value: "years",
        },
      ],
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
        this.content !== this.oldTask.content ||
        this.date !== this.oldTask.date ||
        this.repeat !== this.oldTask.repeat ||
        this.endDate !== this.oldTask.endDate
      ) {
        return false;
      } else return true;
    },
  },

  methods: {
    ...mapActions(["updateTask"]),
    setFields(taskId) {
      this.oldTask = this.taskById(taskId);
      this.id = this.oldTask._id;
      this.content = this.oldTask.content;
      this.completed = this.oldTask.completed;
      this.date = this.oldTask.date;
      this.repeat = this.oldTask.repeat;
      this.endDate = this.oldTask.endDate;
    },
    resetFields() {
      this.id = null;
      this.content = null;
      this.completed = null;
      this.date = null;
      this.repeat = null;
      this.endDate = null;
    },
    ...mapMutations(["closeTaskForm"]),
    cancelHandler() {
      this.closeTaskForm();
    },
    saveHandler() {
      this.updateTask({
        _id: this.id,
        content: this.content,
        completed: this.completed,
        date: this.date,
        repeat: this.repeat,
        endDate: this.endDate,
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
