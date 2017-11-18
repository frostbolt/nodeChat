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

var port = process.env.PORT || 5000;

function dispatch(clients, msg) {
	clients.forEach((e, i, a) => {
		e.send(msg);
	});
}

app.ws('/', (ws, req) => {
	ws.on('message', (msg) => {
		let data = JSON.parse(msg);
		let clients = expressWs.getWss().clients;
		if (!data["system"]) {
			dispatch(clients, msg);
		} else if (data["avatar"] == "changed"){
			dispatch(clients, JSON.stringify({
				system: true,
				text: "<b>" + data['user'] + "</b> has changed avatar"
			}));			
		} else {
			dispatch(clients, JSON.stringify({
				system: true,
				text: "<b>" + data['user'] + "</b> joined the chat"
			}));
		}
	});
	ws.on('close', () => {
		let clients = expressWs.getWss().clients;
		dispatch(clients, JSON.stringify({
			system: true,
			text: "someone has just left the chat"
		}));
	});
});

app.listen(port, function() {
	console.log("Listening on " + port);
});