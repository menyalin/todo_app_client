<template>
  <div>
    <v-menu
      v-model="dialog"
      :close-on-content-click="true"
      transition="scale-transition"
      top
      left
      max-width="290px"
      min-width="auto"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>mdi-calendar</v-icon>
        </v-btn>
      </template>
      <v-date-picker
        :value="date"
        no-title
        @input="changeDate"
        color="primary"
      ></v-date-picker>
    </v-menu>
  </div>
</template>
<script>
import moment from "moment";
export default {
  name: "dateSelector",
  props: {
    date: {
      type: String,
      default: moment().format("YYYY-MM-DD"),
    },
  },
  data: () => ({
    dialog: false,
  }),
  methods: {
    changeDate(val) {
      this.$emit("changeCurrentDate", val);
    },
  },
};
</script>
<style></style>
