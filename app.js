var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var expressWs = require('express-ws')(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));
 
var clientUsernames = {};

function dispatch(clients, msg) {
	console.log(msg);
	clients.forEach((e, i, a) => {
		e.send(msg);
	});
}

app.ws('/', (ws, req) => {
  ws.on('message', (msg) => {
    let data = JSON.parse(msg);
    let clients = expressWs.getWss().clients;
    if (data["message"] != undefined) {
    	dispatch(clients, '' + data["user"] + ": " + data["message"]);
    } else {
    	dispatch(clients, '### '  + data["user"] + '   joins! ###');
    	clientUsernames[ws] = data["user"];
    }
  });
  ws.on('close', () => {
  	let clients = expressWs.getWss().clients;
  	dispatch(clients, "### " + clientUsernames[ws] + " left! ###")
  });
});

app.listen(5000,  () => {
  console.log('Example app listening on port 80!');
});