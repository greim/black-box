/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * MIT License. See mit-license.txt for more info.
 */

'use strict'

import { task } from './task'
import { EventEmitter } from 'events'

export class Communications extends EventEmitter {

  constructor() {
    super()
    this._incoming = task()
    this._outgoing = task()
  }

  receive() {
    return this._incoming
  }

  send(val) {
    this._outgoingVal = val
    this.emit('value', val)
    this._outgoing.resolve(val)
    this._outgoing = task()
  }

  _send(val) {
    this._incomingVal = val
    this._incoming.resolve(val)
    this._incoming = task()
  }

  _receive() {
    return this._outgoing
  }

  sample() {
    return this._incomingVal
  }

  is(val) {
    return this._incomingVal === val
  }
}
