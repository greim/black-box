/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * MIT License. See mit-license.txt for more info.
 */

'use strict'

/*
 * Finite state machine to implement a turnstile.
 */

import { BlackBox } from '../index'

var box = new BlackBox(function*(coms) {
  let state = 'locked'
  while (true) {
    let input = yield coms.receive()
    if (input === 'push' && state === 'unlocked') {
      coms.send('lock')
      state = 'locked'
    } else if (input === 'coin' && state === 'locked') {
      coms.send('unlock')
      state = 'unlocked'
    }
  }
})
