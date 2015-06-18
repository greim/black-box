/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * MIT License. See mit-license.txt for more info.
 */

'use strict'

import { task } from './task'

export class Queue {

  constructor() {
    this._supply = []
    this._demand = []
  }

  in(val) {
    this._current = val
    if (this._demand.length > 0) {
      let { value, receipt } = this._demand.shift()
      value.resolve(val)
      return receipt
    } else {
      let receipt = task()
        , value = Promise.resolve(val)
      this._supply.push({ value, receipt })
      return receipt
    }
  }

  out() {
    if (this._supply.length > 0) {
      let { value, receipt } = this._supply.shift()
      receipt.resolve()
      return value
    } else {
      let value = task()
        , receipt = Promise.resolve()
      this._demand.push({ receipt, value })
      return value
    }
  }

  sample() {
    return this._current
  }

  is(val) {
    return this._current === val
  }
}
