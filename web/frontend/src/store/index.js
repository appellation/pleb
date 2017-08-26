import Vue from 'vue';
import Vuex from 'vuex';
import * as types from './types';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    auth: null,
    playlists: [],
    info: {
      guilds: 0,
      users: 0,
      playlists: 0,
    },
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
    },
    [types.INFO_SET](state, data) {
      state.info = data;
    }
  },
  actions: {
    [types.LOGIN]({ commit, state }, data) {
      //
    }
  }
});
