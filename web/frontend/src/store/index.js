import Vue from 'vue';
import Vuex from 'vuex';
import * as types from './types';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    auth: null,
  },
  mutations: {
    [types.LOGIN](state, data) {
      console.log(data);
      state.auth = data;
    },
    [types.LOGOUT](state) {
      state.auth = null;
    },
  },
  actions: {
    [types.LOGIN]({ commit, state }, data) {
      //
    }
  }
});
