require('babel/polyfill');

var clientAgent = require('./lib/clientAgent')
var cAge=clientAgent.Client;

var frontend_port = 9090;
var agent_port = 9999;
var listen_address = '0.0.0.0';
var ecmascript_version = 7;      // supports values: 5,6,7 (through babel.js)

// loading ECMAScript 6/7 polyfill if required (you need to manually install it)
if (ecmascript_version > 5) {
  require('babel/polyfill');
}


console.log(cAge);
cAgent = new cAge(35);
console.log(cAgent);
cAgent.start("ws://localhost:10100");
