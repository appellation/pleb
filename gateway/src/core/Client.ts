import EventEmitter = require('events');

import Connection from '../ws/Connection';
import Redis from '../redis';

import { Error, codes } from '../util/errors';
import request from '../util/request';

export type Gateway = { url: string, shards: number } | null;

export default class Client extends EventEmitter {
  public readonly connections: Connection[] = [];
  public readonly redis: Redis;

  public gateway: Gateway = null;

  constructor() {
    super();
    this.redis = new Redis(this);
  }

  async fetchGateway(): Promise<Gateway> {
    return this.gateway = (await request.get('/gateway/bot')).data;
  }

  spawn() {
    if (!this.gateway) throw new Error(codes.NO_GATEWAY);

    this.connections.splice(0, this.connections.length);
    for (let i = 0; i < this.gateway.shards; i++) {
      const conn = new Connection(this, i);
      this.connections.push(conn);
      conn.connect();
    }
  }
};
