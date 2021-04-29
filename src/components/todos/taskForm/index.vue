<template>
  <v-dialog
    v-model="isFormOfTaskVisible"
    persistent
    @click:outside="outsideClick"
    @keydown.esc="pressEsc"
    max-width="500"
  >
    <v-card>
      <v-card-title class="headline"> form_task_title </v-card-title>

      <v-card-text>
        <v-text-field label="task_content" hide-details="" />
        <v-checkbox label="completed" />
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="green darken-1" text @click="cancelHandler">
          Cancel
        </v-btn>

        <v-btn color="green darken-1" text @click="saveHandler"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "taskForm",
  data() {
    return {
      dialog: true,
    };
  },
  computed: {
    ...mapGetters(["isFormOfTaskVisible"]),
  },
  methods: {
    ...mapMutations(["closeTaskForm"]),
    cancelHandler() {
      this.closeTaskForm();
    },
    saveHandler() {
      this.dialog = false;
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
