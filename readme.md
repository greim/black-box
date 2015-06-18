# Black Box

A black box is a thing you can send values into, and from which other values emerge.
Sending and receiving is asynchronous.
A black box's interior is a generator.
All operations are asynchronous.
In unicast mode, sending operations return a receipt promise, whilst receiving operations return a value promise.
This is true whether you're on the inside or outside of a box.
Thus, you must coordinate your sends and receives to alternate.
In broadcast mode, sending operations return undefined, and event subscriptions replace the receiving operation.