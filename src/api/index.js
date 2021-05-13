import axios from "axios";
import store from "../store";
// eslint-disable-next-line no-unused-vars
import router from "../router";

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || "http://localhost:3000/api",
});
api.interceptors.request.use(
  function (config) {
    if (store.getters.token) config.headers.Authorization = store.getters.token;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  function (config) {
    return config;
  },
  function (error) {
    // console.log('error in interceptor', error.response.status)
    // if (error.response.status === 511) {
    //   // return null
    // } else
    return Promise.reject(error);
  }
);
export default api;
