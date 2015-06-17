/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * MIT License. See mit-license.txt for more info.
 */

'use strict'

export function task() {
  let resolve, reject
  let prom = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  prom.resolve = resolve
  prom.reject = reject
}
