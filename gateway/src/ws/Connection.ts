import WebSocket = require('ws');
import os = require('os');
import { Buffer } from 'buffer';

import Manager from './Manager';
import Handler from './EventHandler';

import { Error, codes } from '../util/errors';
import { op } from '../util/constants';

export default class WSConnection {
  public readonly manager: Manager;
  public readonly shard: number;
  public readonly events: Handler;

  public encoding: 'json' | 'etf' = 'json';
  public version: number = 6;

  private _ws: WebSocket;

  constructor(manager: Manager, shard: number = 0) {
    this.manager = manager;
    this.shard = shard;

    this.events = new Handler(this);
  }

  public get ws() {
    return this._ws;
  }

  public connect() {
    if (!this.manager.gateway) throw new Error(codes.NO_GATEWAY);

    this._ws = new WebSocket(this.manager.gateway.url);
    this._ws.on('message', this.events.receive);
  }

  public disconnect() {
    this._ws.close();
    this._ws.removeListener('message', this.events.receive);
  }

  public heartbeat() {
    return this.events.send(op.HEARTBEAT, this.events.seq);
  }

  public identify() {
    if (!this.manager.gateway) throw new Error(codes.NO_GATEWAY);

    return this.events.send(op.IDENTFY, {
      token: process.env.discord,
      properties: {
        $os: os.platform(),
        $browser: 'pleb',
        $device: 'pleb',
      },
      compress: false,
      large_threshold: 250,
      shard: [this.shard, this.manager.gateway.shards],
      presence: {},
    });
  }
};
