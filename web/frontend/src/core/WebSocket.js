export const OP = {
  IDENTIFY: 1,
  READY: 2,
};

export default class Socket extends WebSocket {
  constructor() {
    super('ws://localhost:3000');
    this.addEventListener('message', this.listener.bind(this));
    this.ready = false;
    this.id = null;
  }

  listener(event) {
    const data = JSON.parse(event);
    if (data.op === OP.READY) {
      this.id = data.d.id;
      this.ready = true;
    }
  }
}
