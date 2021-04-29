import Vue from "vue";
import VueRouter from "vue-router";

const todos = () => import("../components/todos");
const taskForm = () => import("../components/todos/taskForm");
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "todos",
    component: todos,
  },
  {
    path: "/test",
    name: "test",
    component: taskForm,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
