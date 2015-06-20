# Black Box

Build state machines using generators.

```js
import { BlackBox } from 'black-box'
let box = new BlackBox(genFn, opts)
```

## Multicast Mode

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

```js
let opts = { mode: 'unicast' }
let box = new BlackBox(function*(coms) {
  let val = yield coms.in()
  yield coms.out(val)
}, opts)
box.in('hello').then(() => { ... })
box.out().then(val => { ... })
```

