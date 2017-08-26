import * as types from '../store/types';
import Socket from '../core/WebSocket';

export default {
  install(Vue, { store }) {
    Vue.prototype.$ws = new Socket(store);
  }
}
