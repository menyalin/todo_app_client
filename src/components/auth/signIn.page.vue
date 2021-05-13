<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-form @submit.prevent="submit">
            <v-card-text>
              <transition name="fade">
                <v-alert :type="messageType" v-if="!!message">
                  {{ message }}
                </v-alert>
              </transition>
              <v-text-field
                label="Email"
                prepend-icon="mdi-at"
                type="email"
                v-model="email"
              />
              <v-text-field
                id="password"
                v-model="password"
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
              />
            </v-card-text>
            <v-card-actions>
              <router-link to="/auth/signup">
                <small>Register now</small>
              </router-link>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                type="submit"
                :loading="loading"
                :disabled="!isFormValid && loading"
              >
                Submit
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data: () => ({
    formTitle: "Login form",
    loading: false,
    email: "",
    password: "",
    message: null,
    messageType: null,
    errorTimeoutMs: 5000,
  }),
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (vm.$store.getters.isLoggedIn) {
        vm.$router.push("/");
      }
    });
  },
  computed: {
    isFormValid() {
      return !!this.email && this.password;
    },
  },
  methods: {
    ...mapActions(["signIn"]),
    showMessage(message, messageType) {
      this.message = message;
      this.messageType = messageType;
      setTimeout(() => {
        this.message = null;
        this.messageType = null;
      }, this.errorTimeoutMs);
    },
    submit() {
      this.loading = true;
      const user = { email: this.email, password: this.password };
      this.signIn(user)
        .then((res) => {
          if (res.status === 201 && res.data.token) {
            this.$router.push(this.$route.query.redirect || "/");
          }
        })
        .catch((e) => {
          if (e.response.status === 404) {
            this.showMessage("User not found", "error");
          } else {
            this.showMessage(e.message, "error");
          }
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
