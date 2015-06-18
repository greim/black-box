/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * MIT License. See mit-license.txt for more info.
 */

'use strict'

import { task } from './task'

export class Queue {

  constructor(isNotNoop=true) {
    this._isNotNoop = isNotNoop
  }

  in(val) {
    this._current = val
    if (this._demand) {
      let { value, receipt } = this._demand
      value.resolve(val)
      return receipt
    } else if (this._isNotNoop) {
      let receipt = task()
        , value = Promise.resolve(val)
        , supply = this._supply
      this._supply = { value, receipt }
      if (supply) {
        let { receipt } = supply
        receipt.reject(new Error('too much supply'))
      }
      return receipt
    }
  }

  out() {
    if (this._supply) {
      let { value, receipt } = this._supply
      receipt.resolve()
      return value
    } else if (this._isNotNoop) {
      let value = task()
        , receipt = Promise.resolve()
        , demand = this._demand
      this._demand = { receipt, value }
      if (demand) {
        let { value } = demand
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
