console.log("main.js loaded!");


var login_div = document.querySelector("#login");
var chat_div = document.querySelector("#chat");

var btn_send = document.querySelector("#btn_send");
var btn_login = document.querySelector("#btn_login");
var login_text = document.querySelector("#login_text");
var textarea = document.querySelector("#chat_text");
var chat_msg = document.querySelector("#chat_msg");

var ws = new WebSocket(location.origin.replace(/^http/, 'ws'));

var userName = "unknown"

ws.onerror = () => console.log('WebSocket error');
ws.onopen = () => console.log('WebSocket connection established');
ws.onclose = () => console.log('WebSocket connection closed');
ws.onmessage = (message) => {
	console.log('Server sent:', message);
	textarea.innerHTML += '\n' + message.data;
}

btn_login.onclick = () => {
	userName = (login_text.value == "") ? "unknown" : login_text.value ;
	login_div.classList.add("hidden");
	chat_div.classList.remove("hidden");
	ws.send(JSON.stringify({
		user: userName
	}));
}

btn_send.onclick = () => {
	console.log("btn clicked");
	if (chat_msg.value != ""){
		ws.send(JSON.stringify({
			user: userName,
			message:  chat_msg.value
		}));
		chat_msg.value = "";
	}

}

