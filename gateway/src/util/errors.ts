export enum codes {
  NO_GATEWAY,
  ARRAYBUFFER_RECEIVED,
  ERLPACK_NOT_INSTALLED,
  INVALID_ENCODING,
};

export const messages = {
  [codes.NO_GATEWAY]: 'No gateway to connect to.',
  [codes.ARRAYBUFFER_RECEIVED]: 'ArrayBuffer data received in Node environment.',
  [codes.ERLPACK_NOT_INSTALLED]: 'Cannot use etf encoding without erlpack installed.',
  [codes.INVALID_ENCODING]: 'Invalid encoding specified.',
};

export class Error extends global.Error {
  public readonly code: codes;

  constructor(code: codes) {
    super(messages[code]);
    this.code = code;
  }
}
