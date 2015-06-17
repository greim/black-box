/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * MIT License. See mit-license.txt for more info.
 */

'use strict'

import co from 'co'
import { Communications } from './communications'
import { EventEmitter } from 'events'

export class BlackBox extends EventEmitter {

  constructor(run) {
    super()
    this._coms = new Communications()
    this._process = co(run(this._coms))
    this._coms.on('value', val => this.emit('value', val))
  }

  send(val) {
    this._coms._send(val)
  }

  receive() {
    return this._coms._receive()
  }

  sample() {
    return this._coms._outgoingVal
  }

  is(val) {
    return this._coms._outgoingVal === val
  }

  then(cb, eb) {
    return this._process.then(cb, eb)
  }

  catch(eb) {
    return this._process.catch(eb)
  }
}
