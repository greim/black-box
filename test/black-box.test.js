/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * MIT License. See mit-license.txt for more info.
 */

'use strict'

import assert from 'assert'
import co from 'co'
import { BlackBox } from '../lib/black-box'
import { sequence } from '../lib/sequence'
import { immediate } from '../lib/immediate'

describe('black-box', () => {

  it('should construct without error', () => {
    new BlackBox(function*(){})
  })

  it('should construct an object', () => {
    let box = new BlackBox(function*(){})
    assert.strictEqual(typeof box, 'object')
  })

  it('should not construct without "new" keyword', () => {
    assert.throws(() => BlackBox(function*(){}), 'as a function')
  })

  it('should send input', () => {
    let box = new BlackBox(function*(){})
    box.in(1)
  })

  it('should receive input', done => {
    let box = new BlackBox(function*(coms){
      var val = yield coms.in()
      assert.strictEqual(val, 1)
      done()
    })
    box.in(1)
  })

  it('should send output', () => {
    new BlackBox(function*(coms){
      coms.out(2)
    })
  })

  it('should receive output', co.wrap(function*() {
    let box = new BlackBox(function*(coms){
      coms.out(2)
    })
    var val = yield box.out()
    assert.strictEqual(val, 2)
  }))

  it('completion should return promise', () => {
    let p = new BlackBox(function*(){}).completion()
    assert.ok(p instanceof Promise)
  })

  it('completion should report errors', done => {
    new BlackBox(function*(){ throw new Error('oops') })
    .completion()
    .catch(function(err) {
      assert.strictEqual(err.message, 'oops')
      done()
    })
  })

  it('sending output should return promise', () => {
    let box = new BlackBox(function*(){})
    var p = box.out()
    assert.ok(p instanceof Promise)
  })

  it('receiving input should return promise', () => {
    return new BlackBox(function*(coms){
      let p = coms.in()
      assert.ok(p instanceof Promise)
    }).completion()
  })

  it('should buffer outbound', co.wrap(function*() {
    let step = sequence()
    let box = new BlackBox(function*(coms){
      step(0)
      coms.out(1)
      coms.out(2)
      coms.out(3)
      step(1)
    })
    step(2)
    let outs = [box.out(), box.out(), box.out()]
    step(3)
    outs = yield outs
    step(4)
    assert.deepEqual(outs, [1, 2, 3])
  }))

  it('should defecit outbound', co.wrap(function*() {
    let step = sequence()
    let box = new BlackBox(function*(coms){
      step(0)
      yield immediate()
      step(3)
      coms.out(1)
      coms.out(2)
      coms.out(3)
      step(4)
    })
    step(1)
    let outs = [box.out(), box.out(), box.out()]
    step(2)
    outs = yield outs
    step(5)
    assert.deepEqual(outs, [1, 2, 3])
  }))

  it('should buffer inbound', co.wrap(function*() {
    let step = sequence()
    let box = new BlackBox(function*(coms){
      step(0)
      yield immediate()
      step(3)
      let ins = [coms.in(), coms.in(), coms.in()]
      step(4)
      ins = yield ins
      step(5)
      assert.deepEqual(ins, [1, 2, 3])
    })
    step(1)
    box.in(1)
    box.in(2)
    box.in(3)
    step(2)
  }))

  it('should defecit inbound', co.wrap(function*() {
    let step = sequence()
    let box = new BlackBox(function*(coms){
      step(0)
      let ins = [coms.in(), coms.in(), coms.in()]
      step(1)
      ins = yield ins
      step(4)
      assert.deepEqual(ins, [1, 2, 3])
    })
    step(2)
    box.in(1)
    box.in(2)
    box.in(3)
    step(3)
  }))

  it('should emit outbound vals', () => {
    let box = new BlackBox(function*(coms){
      for (let i=0; i<3; i++) {
        yield immediate()
        coms.out(i)
      }
    })
    let step = sequence()
    box.on('value', val => {
      assert.ok(val < 3)
      step(val)
    })
    return box.completion()
  })

  it('should end', () => {
    let step = sequence()
    let box = new BlackBox(function*(){
      while (true) {
        step(0)
        yield immediate()
        step(-1)
      }
    })
    step(1)
    box.end()
    return box.completion()
  })
})
