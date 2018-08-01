const _ = require('lodash')
const osc = require('node-osc')
const dictionary = require("lib/sample.json")
const keypress = require('keypress')
const tty = require('tty');

const client = new osc.Client('127.0.0.1', 3333);

keypress(process.stdin);

async function start() {
  const oscServer = await new osc.Server(3333, '0.0.0.0');
  console.log('server started')
  oscServer.on("message", function (msg, rinfo) {
        console.log("TUIO message:");
        console.log(msg);
  });
}

async function send(phrase) {

  client.send(phrase, 200, function () {
    console.log(phrase)
    build = ''
    process.stdin.removeAllListeners('keypress')
    listen(dictionary)
  })


}

start()

let build = ''
let buff = ''


function lookup_and_send(phrase, dict) {

  let lookup = _.find(dict, {name: phrase})
  if (lookup) {
    if (lookup.type == 'command')
      build += "/" + lookup.name
    else {
      if (lookup.type == 'number') {
        build += "/" + phrase
      }
    }
    if (lookup.end) {
      send(build)
    }
    else {
      process.stdin.removeAllListeners('keypress')
      console.log('Found key: ' + lookup.name + '; awaiting next from dict ' + dict[0].name + ' containing : ')
      console.log(_.map(lookup.children, 'name'))
      listen(lookup.children)

    }
  }
  else {
    console.log('cannot find: ' + phrase)
  }
} 

function listen(d) {
  console.log('current dictionary is ' + d[0].name)
  console.log('whole command is ' + build)
  process.stdin.on('keypress', function (ch, key) {
    
    if (key && key.ctrl && key.name == 'c') {
      process.exit();
    }
    if (d[0].type == "number") {
      build += '/' + ch
      send(build)

    } 
    else {
      if (key && key.name == 'space') {
        
        lookup_and_send(buff, d)
        buff = ''
      }
      else if (key && key.name)
        buff += key.name
      else
        console.log(ch)      
    }
  })
}

if (typeof process.stdin.setRawMode == 'function') {
  process.stdin.setRawMode(true);
} else {
  tty.setRawMode(true);
}
process.stdin.resume();

listen(dictionary)