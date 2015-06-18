/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * MIT License. See mit-license.txt for more info.
 */

'use strict'

import { EventEmitter } from 'events'
import co from 'co'
import { Communications } from './communications'

export class BlackBox extends EventEmitter {

  constructor(run) {
    super()
    this._coms = new Communications()
    this._gen = run(this._coms)
    this._process = co(this._gen)
    this._coms.on('value', val => this.emit('value', val))
  }

  in(val) {
    this._coms._incoming.in(val)
  }

  out() {
    return this._coms._outgoing.out()
  }

  sample() {
    return this._coms._outgoing.sample()
  }

  is(val) {
    return this._coms._outgoing.is(val)
  }

  completion() {
    return this._process
  }

  end() {
    this._gen.return()
  }
}
