import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#303640",
        secondary: "#1672bc",
        anchor: "#8c9eff",
        error: "#d42020",
        info: "#28a9e1",
        success: "#2aa650",
        warning: "#fb9602",
      },
    },
  },
});
