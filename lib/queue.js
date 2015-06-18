/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * MIT License. See mit-license.txt for more info.
 */

'use strict'

import { task } from './task'

export class Queue {

  constructor(limit=Infinity) {
    this._supply = []
    this._demand = []
    this._limit = limit
  }

  in(val) {
    this._current = val
    if (this._demand.length > 0) {
      let { value, receipt } = this._demand.shift()
      value.resolve(val)
      return receipt
    } else if (this._limit > 0) {
      let receipt = task()
        , value = Promise.resolve(val)
      this._supply.push({ value, receipt })
      if (this._supply.length > this._limit) {
        let { receipt } = this._supply.shift()
        receipt.reject(new Error('too much supply'))
      }
      return receipt
    }
  }

  out() {
    if (this._supply.length > 0) {
      let { value, receipt } = this._supply.shift()
      receipt.resolve()
      return value
    } else if (this._limit > 0) {
      let value = task()
        , receipt = Promise.resolve()
      this._demand.push({ receipt, value })
      if (this._demand.length > this._limit) {
        let { value } = this._demand.shift()
        value.reject(new Error('too much demand'))
      }
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
