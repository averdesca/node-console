require('babel/polyfill');

var web_console = require('./');

var frontend_port = 9090;
var agent_port = 9999;
var backEnd_port = 10100
var listen_address = '0.0.0.0';
var ecmascript_version = 7;      // supports values: 5,6,7 (through babel.js)

// loading ECMAScript 6/7 polyfill if required (you need to manually install it)
if (ecmascript_version > 5) {
  require('babel/polyfill');
}

web_console.start(frontend_port,agent_port,backEnd_port,listen_address,ecmascript_version); 
