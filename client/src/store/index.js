import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    forgetPasswordNumber: "",
    optVerified: false,
    globalLoadingState: false,
  },
  mutations: {
    SET_GLOBAL_LOADING(state, loadingState) {
      console.log(loadingState);
      state.globalLoadingState = loadingState;
    },
    ADD_FORGET_PASSWORD_NUMBER(state, number) {
      console.log(number);
      state.forgetPasswordNumber = number;
    },
    DESTROY_FORGET_PASSWORD_NUMBER(state) {
      state.forgetPasswordNumber = "";
    },
    ADD_OTP_VERIFIED(state, status) {
      console.log(status);
      state.optVerified = status;
    },
    DESTROY_OTP_VERIFIED(state) {
      state.optVerified = false;
    },
  },
  actions: {
    setGlobalLoadingState({ commit }, loadingState) {
      commit("SET_GLOBAL_LOADING", loadingState);
      setTimeout(() => {
        commit("SET_GLOBAL_LOADING", false);
      }, 20000);
    },
    addForgetPasswordNumber({ commit }, number) {
      commit("ADD_FORGET_PASSWORD_NUMBER", number);
    },
    destroyForgetPasswordNumber({ commit }) {
      commit("DESTROY_FORGET_PASSWORD_NUMBER");
    },
    addOTPVerified({ commit }, status) {
      commit("ADD_OTP_VERIFIED", status);
    },
    destroyOTPVerified({ commit }) {
      commit("DESTROY_OTP_VERIFIED");
    },
  },
  getters: {
    getGlobalLoading: (state) => {
      console.log(state.optVerified);
      return state.globalLoadingState;
    },
    getForgetPasswordNumber: (state) => {
      return state.forgetPasswordNumber;
    },
    getOTPVerified: (state) => {
      return state.optVerified;
    },
  },
  modules: {},
});
