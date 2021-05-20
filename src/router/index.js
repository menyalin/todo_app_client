import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";

const todos = () => import("../components/todos");
const carusel = () => import("../components/carusel");

const authLayout = () => import("@/components/auth/auth.layout.vue");
const loginPage = () => import("@/components/auth/signIn.page.vue");
const signUpPage = () => import("@/components/auth/signUp.page.vue");
const mainLayout = () => import("@/components/main.layout.vue");

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: mainLayout,
    children: [
      {
        path: "/",
        name: "todos",
        component: todos,
      },
      {
        path: "/test",
        name: "TestCarusel",
        component: carusel,
      },
    ],
    meta: {
      authRequired: true,
    },
  },
  {
    path: "/auth",
    component: authLayout,
    children: [
      {
        path: "login",
        component: loginPage,
      },
      {
        path: "signup",
        component: signUpPage,
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (
    to.matched.some(
      (record) => record.meta.authRequired && !store.getters.isLoggedIn
    )
  ) {
    next({
      path: "/auth/login",
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
});

export default router;
