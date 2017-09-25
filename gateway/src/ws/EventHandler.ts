import WebSocket = require('ws');
import Connection from './Connection';

import { op } from '../util/constants';
import { Error, codes } from '../util/errors';

let erlpack: void | { unpack: (d: Buffer | Uint8Array) => Object, pack: (d: Object) => Buffer };
try {
  erlpack = require('erlpack');
} catch (e) {
  //
}

export default class WSEventHandler {
  public readonly connection: Connection;
  private _seq: number = -1;
  private _session: string;
  private _heartbeatTimeout: NodeJS.Timer;

  constructor(connection: Connection) {
    this.connection = connection;
    this.receive = this.receive.bind(this);
  }

  public get seq() {
    return this._seq;
  }

  public get session() {
    return this._session;
  }

  public receive(data: WebSocket.Data) {
    const decoded = this.decode(data);
    if (decoded.s) this._seq = decoded.s;

    console.log(`RECEIVED: ---------`);
    console.log(decoded);
    console.log();

    switch (decoded.op) {
      case op.DISPATCH:
        // normal gateway events
        break;
      case op.HEARTBEAT:
        this.connection.heartbeat();
        break;
      case op.RECONNECT:
        // client should reconnect to the gateway
        break;
      case op.INVALID_SESSION:
        // invalid session id
        break;
      case op.HELLO:
        if (this._heartbeatTimeout) clearTimeout(this._heartbeatTimeout);
        this._heartbeatTimeout = setTimeout(this.connection.heartbeat.bind(this.connection), decoded.d.heartbeat_interval);

        if (this._session) this.connection.resume();
        else this.connection.identify();

        break;
      case op.HEARTBEAT_ACK:
        // heartbeat ack
        break;
    }
  }

  public send(op: number, d: Object) {
    console.log(`SENDING: ----------`);
    console.log(op, d);
    console.log();

    return this.connection.ws.send(this.encode({ op, d }));
  }

  public decode(data: WebSocket.Data) {
    if (data instanceof ArrayBuffer) throw new Error(codes.ARRAYBUFFER_RECEIVED);
    if (Array.isArray(data)) data = data.join();

    switch (this.connection.encoding) {
      case 'json':
        if (data instanceof Buffer) return JSON.parse(data.toString());
        return JSON.parse(data);
      case 'etf':
        if (typeof erlpack === 'undefined') throw new Error(codes.ERLPACK_NOT_INSTALLED);
        if (typeof data === 'string') data = Buffer.from(data);
        return erlpack.unpack(data);
      default:
        throw new Error(codes.INVALID_ENCODING);
    }
  }

  public encode(data: Object) {
    switch (this.connection.encoding) {
      case 'json':
        return JSON.stringify(data);
      case 'etf':
        if (typeof erlpack === 'undefined') throw new Error(codes.ERLPACK_NOT_INSTALLED);
        return erlpack.pack(data);
    }
  }
}
