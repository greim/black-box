/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * MIT License. See mit-license.txt for more info.
 */

'use strict'

export function immediate() {
  return new Promise(res => {
    setImmediate(res)
  })
}
