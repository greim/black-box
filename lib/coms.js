/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * MIT License. See mit-license.txt for more info.
 */

'use strict'

import { Channel } from './channel'
import { EventEmitter } from 'events'

export class Coms extends EventEmitter {

  constructor(opts) {
    super()
    let queueIsNotNoop = opts.mode !== 'broadcast'
    this._incoming = new Channel(queueIsNotNoop)
    this._outgoing = new Channel(queueIsNotNoop)
  }

  in() {
    return this._incoming.out()
  }

  out(val) {
    this.emit('out', val)
    return this._outgoing.in(val)
  }

  sample() {
    return this._incoming.sample()
  }

  is(val) {
    return this._incoming.is(val)
  }
}
