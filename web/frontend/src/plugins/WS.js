import * as types from '../store/types';
import WebSocket from '../core/WebSocket';

export const socket = new WebSocket();

export default {
  install(Vue, { store }) {
    Vue.prototype.$ws = socket;
  }
}
