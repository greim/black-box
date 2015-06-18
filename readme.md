# Black Box

This is experimental.
A black box instance is a thing that you can send values into, and from which other values emerge.
It's all asynchronous, so there may be arbitrarily many ticks between things.
The interior of a black box is a generator defining its state machine.
The input and output of a black box is a single value, there are not multiple channels.
For that you'd just use multiple black boxes.
