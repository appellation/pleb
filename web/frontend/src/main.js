// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import * as App from './App'

import WS, { socket } from './plugins/WS';
// import Auth from './plugins/Auth';

import router from './router'
import store from './store';
import * as filters from './filters';

Vue.config.productionTip = false;
Vue.use(WS, { store });
// Vue.use(Auth, { store, ws: socket });

window.app = new Vue({
  el: '#app',
  router,
  store,
  filters,
  template: '<App/>',
  components: { App }
})
