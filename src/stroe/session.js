import { removeToken, removeUsername } from "../utils/auth";
import router from "../router";

export default {
  state: {},
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    }
  },
  actions: {
    // session超时--跳转到登录页
    LogOut({ commit }) {
      return new Promise(resolve => {
        commit("SET_TOKEN", "");
        removeToken();
        removeUsername();
        resolve();
        router.replace("/login");
        location.reload();
      });
    }
  }
};
