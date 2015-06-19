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

  it('box should sample', () => {
    let box = new BlackBox(function*(coms){ coms.out(3) })
    let sample = box.sample()
    assert.strictEqual(sample, 3)
  })

  it('box should is', () => {
    let box = new BlackBox(function*(coms){ coms.out(4) })
    assert.ok(!box.is(5))
    assert.ok(box.is(4))
    assert.ok(!box.is(3))
  })

  it('coms should sample', () => {
    let box = new BlackBox(function*(coms){
      yield immediate()
      let sample = coms.sample()
      assert.strictEqual(sample, 1)
    })
    box.in(1)
    return box.completion()
  })

  it('coms should is', () => {
    let box = new BlackBox(function*(coms){
      yield immediate()
      assert.ok(!coms.is(3))
      assert.ok(coms.is(2))
      assert.ok(!coms.is(1))
    })
    box.in(2)
    return box.completion()
  })

  it('should ping-pong', () => {
    let box = new BlackBox(function*(coms){
      while (true) {
        let input = yield coms.in()
        if (input === 'stop') { break }
        yield coms.out(input)
      }
    })
    let p = co(function*() {
      for (let i=0; i<3; i++) {
        yield box.in(i)
        let x = yield box.out()
        assert.strictEqual(x, i)
      }
      yield box.in('stop')
    })
    return Promise.all([p, box.completion()])
  })

  it('should set context', () => {
    let box = new BlackBox(function*(){
      yield immediate()
      assert.strictEqual(this, box)
    })
    return box.completion()
  })
})
