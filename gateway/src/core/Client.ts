import request from '../util/request';
import Connection from '../ws/Connection';

import { Error, codes } from '../util/errors';

export type Gateway = { url: string, shards: number } | null;

export default class Client {
  public readonly connections: Connection[];
  public gateway: Gateway;

  constructor() {
    this.connections = [];
    this.gateway = null;
  }

  async fetchGateway(): Promise<Gateway> {
    return this.gateway = (await request.get('/gateway/bot')).data;
  }

  spawn() {
    if (!this.gateway) throw new Error(codes.NO_GATEWAY);
    for (let i = 0; i < this.gateway.shards; i++) {
      const conn = new Connection(this, i);
      this.connections.push(conn);
      conn.connect();
    }
  }
};
