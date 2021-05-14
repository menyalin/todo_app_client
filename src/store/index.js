import Vue from "vue";
import Vuex from "vuex";
import todosModule from "./todos";
import router from "../router";

import api from "@/api";

const initPlugin = (store) => {
  if (store.getters.token) {
    store.commit("setAppLoading", true);
    Promise.all([store.dispatch("getTasks"), store.dispatch("getUserData")])
      .catch(() => {})
      .finally(() => store.commit("setAppLoading", false));
  }
};

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("token") || null,
    user: null,
    loading: false,
    appLoading: false,
    error: null,
    baseUrl: process.env.VUE_APP_API_URL,
  },
  mutations: {
    setAppLoading(state, payload) {
      state.appLoading = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    setError(state, payload) {
      state.error = payload;
    },
    clearError(state) {
      state.error = null;
    },
    setToken(state, payload) {
      state.token = payload;
      localStorage.setItem("token", payload);
    },
    setUser(state, payload) {
      state.user = payload;
    },
    logOut(state) {
      localStorage.removeItem("token");
      state.token = null;
      state.user = null;
      router.push("/auth/login");
    },
  },
  actions: {
    signUp({ commit, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        api
          .post("/auth/registration", payload)
          .then(({ data }) => {
            commit("setToken", data.token);
            dispatch("getUserData");
            resolve(data);
          })
          .catch((e) => reject(e));
      });
    },
    getUserData({ commit }) {
      return new Promise((resolve, reject) => {
        api
          .get("/auth")
          .then((res) => {
            if (res.data.data) commit("setUser", res.data.data);
            else commit("logOut");
            resolve(res);
          })
          .catch((e) => {
            if (e.response.status === 401) commit("logOut");
            reject(e);
          });
      });
    },
    signIn({ commit, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        api
          .post("/auth/login", payload)
          .then((res) => {
            commit("setToken", res.data.token);
            dispatch("getUserData");
            resolve(res);
          })
          .catch((e) => reject(e));
      });
    },
  },
  getters: {
    baseUrl: ({ baseUrl }) => baseUrl,
    error: ({ error }) => error,
    appLoading: ({ appLoading }) => appLoading,
    loading: ({ loading }) => loading,
    isLoggedIn: ({ token }) => !!token,
    token: ({ token }) => token,
    user: ({ user }) => user,
  },
  modules: {
    todosModule,
  },
  plugins: [initPlugin],
});
