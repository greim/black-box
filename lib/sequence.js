/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * MIT License. See mit-license.txt for more info.
 */

'use strict'

import assert from 'assert'

export function sequence() {
  let expected = 0
    , history = []
  return n => {
    history.push(n)
    assert.ok(typeof n === 'number', 'wrong sequence type')
    assert.strictEqual(n, expected, `wrong sequence order: ${history.join(', ')}`)
    expected++
  }
}