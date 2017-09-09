import * as types from '../store/types';

export const OP = {
  IDENTIFY: 1,
  READY: 2,
  INFO: 3,
  DATA: 4,
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
    switch (data.op) {
      case OP.READY:
        this.store.commit(types.WS_CONNECTED, data.d);
        break;
      case OP.IDENTIFY:
        this.store.commit(types.LOGIN, data.d);
        break;
      case OP.INFO:
        this.store.commit(types.INFO_SET, data.d);
        break;
      case OP.DATA:
        this.store.commit(types[`${data.t.toUpperCase()}_${data.a.toUpperCase()}`], data.d);
        break;
    }
  }
}
