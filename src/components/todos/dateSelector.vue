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
        v-model="date"
        no-title
        @input="changeDate"
      ></v-date-picker>
    </v-menu>
  </div>
</template>
<script>
export default {
  name: "dateSelector",
  data: () => ({
    dialog: false,
    date: null,
  }),
  methods: {
    changeDate(val) {
      this.$emit("changeCurrentDate", val);
    },
  },
};
</script>
<style></style>
