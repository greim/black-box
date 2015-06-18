/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * MIT License. See mit-license.txt for more info.
 */

'use strict'

import assert from 'assert'
import co from 'co'
import { Queue } from '../lib/queue'
import { sequence } from '../lib/sequence'

describe('queue', () => {

  it('should construct without error', () => {
    new Queue()
  })

  it('should construct an object', () => {
    let queue = new Queue()
    assert.strictEqual(typeof queue, 'object')
  })

  it('should not construct without "new" keyword', () => {
    assert.throws(() => Queue(), 'as a function')
  })

  it('in() should return a promise', () => {
    let queue = new Queue()
      , p = queue.in(1)
    assert.ok(p instanceof Promise)
  })

  it('out() should return a promise', () => {
    let queue = new Queue()
      , p = queue.out()
    assert.ok(p instanceof Promise)
  })

  it('should resolve a pair, in first', co.wrap(function*(){
    let queue = new Queue()
      , pair = yield [queue.in(1), queue.out()]
    assert.deepEqual(pair, [undefined, 1])
  }))

  it('should resolve a pair, out first', co.wrap(function*(){
    let queue = new Queue()
      , pair = yield [queue.out(), queue.in(1)]
    assert.deepEqual(pair, [1, undefined])
  }))

  it('should resolve a nested set', co.wrap(function*(){
    let q = new Queue()
      , set = yield [q.in(1), q.in(2), q.in(3), q.out(), q.out(), q.out()]
    assert.deepEqual(set, [undefined, undefined, undefined, 1, 2, 3])
  }))

  it('should resolve an inverted nested set', co.wrap(function*(){
    let q = new Queue()
      , set = yield [q.out(), q.out(), q.out(), q.in(1), q.in(2), q.in(3)]
    assert.deepEqual(set, [1, 2, 3, undefined, undefined, undefined])
  }))

  it('should resolve an interspersed set', co.wrap(function*(){
    let q = new Queue()
      , set = yield [q.in(1), q.out(), q.in(2), q.out(), q.in(3), q.out()]
    assert.deepEqual(set, [undefined, 1, undefined, 2, undefined, 3])
  }))

  it('should not resolve an unbalanced set', done => {
    let q = new Queue()
      , set = [q.in(1), q.out(), q.in(2)]
    Promise.all(set).then(vals => done(new Error(`should not resolve ${vals.join(', ')}`)))
    setImmediate(() => done())
  })

  it('should not resolve an unbalanced set', done => {
    let q = new Queue()
      , set = [q.out(), q.in(1), q.out()]
    Promise.all(set).then(vals => done(new Error(`should not resolve ${vals.join(', ')}`)))
    setImmediate(() => done())
  })

  it('should sample', () => {
    let queue = new Queue()
    queue.in(3)
    let sample = queue.sample()
    assert.strictEqual(sample, 3)
  })

  it('should is', () => {
    let queue = new Queue()
    queue.in(4)
    assert.ok(!queue.is(5))
    assert.ok(queue.is(4))
    assert.ok(!queue.is(3))
  })

  it('should do things in order', () => {
    let queue = new Queue()
      , step = sequence()
    let proms = [
      queue.out().then(() => step(0)),
      queue.in('a').then(() => step(1)),
      queue.out().then(() => step(2)),
      queue.in('b').then(() => step(3)),
      queue.in('c').then(() => step(4)),
      queue.out().then(() => step(5)),
      queue.out().then(() => step(6)),
      queue.in('d').then(() => step(7)),
    ]
    return Promise.all(proms)
  })

  it('should limit supply', () => {
    let queue = new Queue(2)
    let p = queue.in(1).catch(err => {
      assert.ok(err.message.includes('too much supply'))
    })
    queue.in(2)
    queue.in(3)
    return p
  })

  it('should limit demand', () => {
    let queue = new Queue(2)
    let p = queue.out().catch(err => {
      assert.ok(err.message.includes('too much demand'))
    })
    queue.out()
    queue.out()
    return p
  })

  it('should be noop with zero limit', () => {
    let queue = new Queue(0)
    assert.strictEqual(queue.in(1), undefined)
    assert.strictEqual(queue.out(), undefined)
  })

  it('should be noop with zero limit', () => {
    let queue = new Queue(0)
    assert.strictEqual(queue.in(1), undefined)
    assert.strictEqual(queue.out(), undefined)
    assert.strictEqual(queue.in(1), undefined)
    assert.strictEqual(queue.out(), undefined)
  })
})
