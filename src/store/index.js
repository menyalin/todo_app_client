import Vue from "vue";
import Vuex from "vuex";

import todosModule from "./todos";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    todosModule,
  },
});
