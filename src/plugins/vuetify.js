import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import { ru, en } from "vuetify/lib/locale";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: "#3949ab",
        secondary: "#424242",
        accent: "#82B1FF",
        error: "#FF5252",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107",
      },
    },
  },
  lang: {
    locales: { ru, en },
    current: "en",
  },
});
