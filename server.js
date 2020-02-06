const express = require('express');
const webSocketServer = require('ws');
const fs = require('fs');
const https = require('https');

const app = express();
const pkey = fs.readFileSync("./ssl/key.pem")
const pcerrt = fs.readFileSync("./ssl/cert.pem"),
const options = {key:pkey, cert:pcerrt, passphrase:'123456789'};

var wss = null;
var sslSvr = null;
//use express static folder to deliver resource HTML, CSS< JS, etc from public foldeer

app.use(express.static('public'));

//start server 

sslSvr = https.createServer(options, app).listen(443);
console.log("The Https server is up and running");

//create webSocket Server

wss = new webSocketServer({server:sslSvr});
console.log("WebSocket secure erver is up and running");

//succesful connection

wss.on('connection', function(client){
    console.log("A new web Socket client was connected");
//incoming messages
client.on('message', function(message){
    //broadcast message to all clients
    wss.broadcast(message, client);
});
});

//broadcating the message to all WebSocket clients

wss.broadcast = function(data, exclude){
    var i = 0,
    var n = this.client ? this.client.length : 0;
    var client = null;

    if(n<1) return;
    console.log("Broadcasting message to all "+n+" webSocket client.");
    for(; i<n; i++){
        client= this.client[i];
        // don't send the message to the sender...
    if (client === exclude) continue;
    if (client.readyState === client.OPEN) client.send(data);
    else console.error('Error: the client state is ' + client.readyState);
  }
};