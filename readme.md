# Black Box

Build state machines using generators.

```js
import { BlackBox } from 'black-box'
let box = new BlackBox(genFn, opts)
```

## Multicast Mode

In/out is fire-and-forget.

```js
let opts = { mode: 'multicast' }
let box = new BlackBox(function*(coms) {
  let val = yield coms.in()
  coms.out(val)
}, opts)
box.on('out', val => { ... })
box.in('hello')
```

## Unicast Mode

In/out is coordinated.

```js
let opts = { mode: 'unicast' }
let box = new BlackBox(function*(coms) {
  let val = yield coms.in()
  yield coms.out(val)
}, opts)
box.in('hello').then(() => { ... })
box.out().then(val => { ... })
```

## Examples

### Finite State Machine

```js
let box = new BlackBox(function*(coms) {
  let state = 'locked'
  while (true) {
    let command = yield coms.in()
    if (command === 'coin' && state === 'locked') {
      yield coms.out('locked => unlocked')
      state = 'unlocked'
    } else if (command === 'push' && state === 'unlocked') {
      yield coms.out('unlocked => locked')
      state = 'locked'
    }
  }
})
```

