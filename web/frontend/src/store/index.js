import Vue from 'vue';
import Vuex from 'vuex';
import * as types from './types';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    ws: {
      id: null,
      ready: false,
    },
    user: null,
    token: null,
    playlists: [],
    info: {
      guilds: 0,
      users: 0,
      playlists: 0,
    },
  },
  mutations: {
    [types.WS_CONNECTED](state, id) {
      state.ws = { ...state.ws, id };
      state.ws.ready = true;
    },
    [types.LOGIN](state, { token, user }) {
      state.token = token;
      state.user = user;
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
