import * as types from '../store/types';

export const OP = {
  IDENTIFY: 1,
  READY: 2,
};

export default class Socket {
  constructor(store) {
    this.store = store;
    this.connection = new WebSocket('ws://localhost:3000');
    this.connection.addEventListener('message', this.listener.bind(this));
    this.ready = false;
    this.id = null;
  }

  listener(event) {
    console.log(event);
    const data = JSON.parse(event.data);
    if (data.op === OP.READY) {
      this.store.commit(types.WS_CONNECTED, data.d.id);
      // this.store.commit(types.INFO_SET, data.d.info);
    } else if (data.op === OP.IDENTIFY) {
      this.store.commit(types.LOGIN, data.d);
    }
  }
}
