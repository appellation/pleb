import Vue from 'vue';
import axios from 'axios';
import * as constants from '../util/Constants';

export default {
  install: function (Vue, { store, ws }) {
    Vue.prototype.$auth = {
      login() {
        if (!store.state.auth && ws.ready) window.location.href = constants.OAuth.AUTH_URL(ws.id);
      },
      isLoggedIn() {
        return !!store.state.auth;
      }
    }
  }
}
