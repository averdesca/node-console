var RemoteAgent = require('./lib/remoteAgent').RemoteAgent;
var WebSocketServer = require('ws').Server;

var self = {};

module.exports = {
  'start': function(port,host,serverPort) {
    self.port = port || 9999;
    self.host = host || '0.0.0.0';
    self.backEndPort = serverPort || 10100;
    if (self.server) return;

    self.server = new WebSocketServer({
      port: self.port,
      host: self.host
    });
      
    self.serverBackend = new WebSocketServer({
      port: self.backEndPort,
      host: self.host
    });

    var agente = new RemoteAgent(self.server, self.serverBackend);
   
    self.serverBackend.on('connection', agente.onBackendConnection.bind(agente));
      
       self.server.on('listening', function() {
      agente.loadAgents();
    });
    self.server.on('connection', agente.onFrontendConnection.bind(agente));
      
  },
  'stop': function() {
   /* frontends.forEach(function(socket){
      socket.close();
    });

    if (server) {
      server.close();
      server = null;
    }*/
  }
}

