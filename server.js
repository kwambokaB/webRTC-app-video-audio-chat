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

wss = new webSocketServer({SERVER:sslSvr});
console.log("WebSocket secure erver is up and running");

//succesful connection

wss.on('connection', function(client){
    console.log("A new web Socket client was connected");
});