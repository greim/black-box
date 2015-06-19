/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * MIT License. See mit-license.txt for more info.
 */

'use strict'

import assert from 'assert'
import co from 'co'
import { Channel } from '../lib/channel'
import { sequence } from '../lib/sequence'

describe('channel', () => {

  it('should construct without error', () => {
    new Channel()
  })

  it('should construct an object', () => {
    let channel = new Channel()
    assert.strictEqual(typeof channel, 'object')
  })

  it('should not construct without "new" keyword', () => {
    assert.throws(() => Channel(), 'as a function')
  })

  it('in() should return a promise', () => {
    let channel = new Channel()
      , p = channel.in(1)
    assert.ok(p instanceof Promise)
  })

  it('out() should return a promise', () => {
    let channel = new Channel()
      , p = channel.out()
    assert.ok(p instanceof Promise)
  })

  it('should resolve a pair, in first', co.wrap(function*(){
    let channel = new Channel()
      , pair = yield [channel.in(1), channel.out()]
    assert.deepEqual(pair, [undefined, 1])
  }))

  it('should resolve a pair, out first', co.wrap(function*(){
    let channel = new Channel()
      , pair = yield [channel.out(), channel.in(1)]
    assert.deepEqual(pair, [1, undefined])
  }))

  it('should resolve an interspersed set', co.wrap(function*(){
    let q = new Channel()
      , set = yield [q.in(1), q.out(), q.in(2), q.out(), q.in(3), q.out()]
    assert.deepEqual(set, [undefined, 1, undefined, 2, undefined, 3])
  }))

  it('should resolve an interspersed set', co.wrap(function*(){
    let q = new Channel()
      , set = yield [q.out(), q.in(1), q.out(), q.in(2), q.out(), q.in(3)]
    assert.deepEqual(set, [1, undefined, 2, undefined, 3, undefined])
  }))

  it('should not resolve an unbalanced set', done => {
    let q = new Channel()
      , set = [q.in(1), q.out(), q.in(2)]
    Promise.all(set).then(vals => done(new Error(`should not resolve ${vals.join(', ')}`)))
    setImmediate(() => done())
  })

  it('should not resolve an unbalanced set', done => {
    let q = new Channel()
      , set = [q.out(), q.in(1), q.out()]
    Promise.all(set).then(vals => done(new Error(`should not resolve ${vals.join(', ')}`)))
    setImmediate(() => done())
  })

  it('should sample', () => {
    let channel = new Channel()
    channel.in(3)
    let sample = channel.sample()
    assert.strictEqual(sample, 3)
  })

  it('should is', () => {
    let channel = new Channel()
    channel.in(4)
    assert.ok(!channel.is(5))
    assert.ok(channel.is(4))
    assert.ok(!channel.is(3))
  })

  it('should do things in order', () => {
    let channel = new Channel()
      , step = sequence()
    let proms = [
      channel.out().then(() => step(0)),
      channel.in('a').then(() => step(1)),
      channel.out().then(() => step(2)),
      channel.in('b').then(() => step(3)),
    ]
    return Promise.all(proms)
  })

  it('should limit supply', () => {
    let channel = new Channel()
    let p = channel.in(1).catch(err => {
      assert.ok(err.message.includes('too much supply'))
    })
    channel.in(2)
    return p
  })

  it('should limit demand', () => {
    let channel = new Channel()
    let p = channel.out().catch(err => {
      assert.ok(err.message.includes('too much demand'))
    })
    channel.out()
    return p
  })

  it('should be noop with broadcast', () => {
    let channel = new Channel(false)
    assert.strictEqual(channel.in(1), undefined)
    assert.strictEqual(channel.out(), undefined)
  })
})
