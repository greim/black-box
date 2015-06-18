# Black Box

A black box is a thing you can send values into, and from which other values emerge.
A black box's interior is a generator.
In unicast mode, sending operations return a receipt promise, whilst receiving operations return a value promise.
This is true whether you're on the inside or outside of a box.
Thus, you must coordinate your sends and receives to alternate.
In broadcast mode, internally, you do not wait for receipts, and externally, you set an event listener on the box instead of doing receiving operations.

```js
// unicast example
let box = new BlackBox(function*(coms) {
  while (true) {
    let n = yield coms.in()
    yield coms.out(n * n)
  }
}, { mode: 'unicast' })

box.in(2)
.then(() => box.out())
.then(n => box.in(n)) // n is 4
.then(() => box.out())
.then(n => box.in(n)) // n is 16
```

```js
// multicast example
let box = new BlackBox(function*(coms) {
  while (true) {
    let n = yield coms.in()
    coms.out(n * n)
  }
}, { mode: 'multicast' })

box.on('value', n => console.log(n))
box.in(2) // 4
box.in(3) // 9
```