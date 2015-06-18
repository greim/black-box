/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * MIT License. See mit-license.txt for more info.
 */

'use strict'

import { Queue } from './queue'
import { EventEmitter } from 'events'

export class Communications extends EventEmitter {

  constructor() {
    super()
    this._incoming = new Queue()
    this._outgoing = new Queue()
  }

  in() {
    return this._incoming.out()
  }

  out(val) {
    this.emit('value', val)
    this._outgoing.in(val)
  }

  sample() {
    return this._incoming.sample()
  }

  is(val) {
    return this._incoming.is(val)
  }
}
