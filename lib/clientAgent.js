var agents = require('../lib');
var WebSocket = require('ws');


function ClientAgent( serverId) {
    this.serverId = serverId;
    this.url = "";
    this.frontends = [];
    this.socket = {};
    this.loadedAgents = {};
    this.notify = function(notification) {
    notification.params.message.serverId = this.serverId;
        this.socket.send(JSON.stringify(notification));
    };
    this.loadAgents = function() {
    console.log(agents);
  var runtimeAgent = new agents.Runtime(this.notify.bind(this));

  for (var agent in agents) {
        if (typeof agents[agent] == 'function' && agent != 'Runtime') {
          this.loadedAgents[agent] = new agents[agent](this.notify.bind(this), runtimeAgent);
        }
      }
      this.loadedAgents.Runtime = runtimeAgent;
    };
    this.start = function(url) {
        this.url = url;

        var self = this;
        //if (this.socket) return;

        this.socket = new WebSocket(this.url);
        //gestisco l'envento on open
        this.socket.on('open', 
           this.open.bind(this));

        this.socket.on('message', self.onFrontendMessage.bind(this));
    
    };
    this.onFrontendConnection = function(frontendSocket) {
        this.frontends.push(frontendSocket);
        frontendSocket.on('message',                       this.onFrontendMessage.bind(frontendSocket));
        frontendSocket.on('close', (function(){
            for(var i =0; i<this.frontends.length;i++){
                if (this.frontends[i] === frontendSocket){
                    this.frontends.splice(i,1);
                }
            }
        }).bind(frontendSocket));
        frontendSocket.on('error', function(error) {
            console.log(error);
            console.error(error);
        });
    };
    this.onFrontendMessage = function(message) {
        var socket = this.socket;
        try {
            data = JSON.parse(message);
        } catch(e) {
            console.error(e.stack);
            return;
        }
        try {
            data = JSON.parse(message);
          } catch(e) {
            console.error(e.stack);
            return;
          }

          var id = data.id;
          var command = data.method.split('.');
          var domain = this.loadedAgents[command[0]];
          var method = command[1];
          var params = data.params;

          if (!domain || !domain[method]) {
            //console.warn('%s is not implemented', data.method);
            return;
          }

        domain[method](params, function(result) {
            var response = {
              id: id,
              result: result
            };

            socket.send(JSON.stringify(response));
        });
    };
this.stop=function() {
    
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  };

this.open= function ()
{
    console.log('connected');
            this.loadAgents();
         this.socket.send(Date.now().toString(), {mask: true});
};
    
}




module.exports = 
    {
    Client :  ClientAgent
};





