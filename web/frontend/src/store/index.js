import Vue from 'vue';
import Vuex from 'vuex';
import * as types from './types';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    auth: null,
    playlists: [],
  },
  mutations: {
    [types.LOGIN](state, data) {
      state.auth = data;
    },
    [types.LOGOUT](state) {
      state.auth = null;
    },
    [types.PLAYLISTS_SET](state, data) {
      state.playlists = data;
    }
  },
  actions: {
    [types.LOGIN]({ commit, state }, data) {
      //
    }
  }
});
