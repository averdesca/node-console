var agents = require('../lib');
var WebSocketServer = require('ws').Server;


function RemoteAgent(frontendSocket, socket) {
    this.frontends = [];
    this.backends = [];
    this.socket = socket;
    this.frontendSocket = frontendSocket;
    this.loadedAgents = {};
    this.notify = function(notification) {
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
    this.onFrontendConnection = function(frontendSocket) {
        var self = {};
        self= this;
        this.frontends.push(frontendSocket);
        frontendSocket.on('message',                       this.onFrontendMessage.bind({socket:socket, frontendSocket:frontendSocket, loadedAgents: this.loadedAgents}));
        frontendSocket.on('close', (function(){
            for(var i =0; i<self.frontends.length;i++){
                if (self.frontends[i] === frontendSocket){
                    self.frontends.splice(i,1);
                }
            }
        }).bind(frontendSocket));
        frontendSocket.on('error', function(error) {
            console.error(error);
        });
    };
    this.onFrontendMessage = function(message) {
        var socket = this.socket;
        var frontendSocket = this.frontendSocket;
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

        socket.clients.forEach(function each(client) {
            client.send(JSON.stringify(data));
        });
    };
    this.onBackendConnection = function(socket) {
        socket.send('{"method":"Runtime.evaluate","params":{"expression":"console.log(1)","objectGroup":"console","includeCommandLineAPI":true,"doNotPauseOnExceptionsAndMuteConsole":false,"returnByValue":false,"generatePreview":true},"id":45}');
        var self = {};
        self= this;
        this.backends.push(socket);
        socket.on('message',                       this.onBackendMessage.bind({socket:socket, frontendSocket:frontendSocket, frontends: this.frontends}));
        socket.on('close', (function(){
            for(var i =0; i<self.backends.length;i++){
                if (self.backends[i] === socket){
                    self.backends.splice(i,1);
                }
            }
        }).bind(socket));
        socket.on('error', function(error) {
            console.error(error);
        });
    };
    this.onBackendMessage = function(message) {
        var socket = this.socket;
        var frontendSocket = this.frontendSocket;
        this.frontends.forEach(function(socket)                     {socket.send(message)});

    };
}




module.exports = 
    {
    RemoteAgent :  RemoteAgent
};





