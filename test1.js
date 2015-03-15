require('babel/polyfill');


var frontend_port = 9090;
var agent_port = 9999;
var listen_address = '0.0.0.0';
var ecmascript_version = 7;      // supports values: 5,6,7 (through babel.js)

// loading ECMAScript 6/7 polyfill if required (you need to manually install it)
if (ecmascript_version > 5) {
  require('babel/polyfill');
}


var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 10100});
wss.on('connection', function(ws) {
    ws.on('message', function(message) {
        console.log('received: %s', message);
    });
    ws.send('{"method":"Runtime.evaluate","params":{"expression":"console.log(1)","objectGroup":"console","includeCommandLineAPI":true,"doNotPauseOnExceptionsAndMuteConsole":false,"returnByValue":false,"generatePreview":true},"id":45}');
});
