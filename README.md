# esperOSC

Takes text (intended to be spoken to eventually) and reads from JSON library of allowed OSC commands, and sends to server.

## Installation

1. Check out this repository
2. Configure your lib/sample.json library (or test with the default)
3. npm install
4. node osc.js
5. Type commands, with a space. Upon each space, the keyword will be looked up at the appropriate level of the JSON file. For example, type "horizontal speedboat accelerate 9". After the keystroke 9, the string will be sent to the OSC listener (on port 3333 by default).
6. Ctrl-C to exit.

## Limitations

This is a mega prototype early alpha super basic version just to get started. At the moment numeric 'value' fields can only be one digit/character long. If you mess up, you must quit and restart to get back to the top of the command hierarchy.