import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueRouter from "vue-router";
import instance from "./config/axios/instance";
import PerfectScrollbar from "vue2-perfect-scrollbar";
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";
import VueSmartRoute from "vue-smart-route";
var VueCookie = require("vue-cookie");

Vue.router = router;
Vue.use(VueRouter);
Vue.use(VueCookie);
Vue.use(PerfectScrollbar);
Vue.use(VueSmartRoute);
Vue.prototype.$http = instance;
Vue.config.productionTip = false;

Vue.mixin({
  data: function() {
    return {
      globalBackgroundColor: "transparent",
      globalFontColor: "grey--text",
      globalSideBarActiveColor: "blue-grey darken-2",
      globalLoaderColor: "blue-grey darken-2",
      get globalBreadCrumb() {
        return (
          this.globalBackgroundColor + " " + this.globalFontColor + " mb-0"
        );
      },
    };
  },
});

new Vue({
  el: "#app",
  router,
  store,
  vuetify,
  render: (h) => h(App),
  created() {
    this.$vuetify.theme.dark = false;
  },
});
