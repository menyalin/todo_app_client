import Vue from "vue";
import VueRouter from "vue-router";

const todos = () => import("../components/todos");

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "todos",
    component: todos,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
