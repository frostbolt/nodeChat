console.log("main.js loaded!");


var login_div = document.querySelector("#login");
var chat_div = document.querySelector("#chat");

var btn_send = document.querySelector("#btn_send");
var btn_login = document.querySelector("#btn_login");
var login_text = document.querySelector("#login_text");
var chat_msg = document.querySelector("#chat_msg");
var chat_window = document.querySelector("#chat_window");

var btn_image_upload = document.querySelector("#image_upload");
var upload_form = document.querySelector("#upload_form");
var userpic_file = document.querySelector("#userpic_file");

var userName = "unknown"
var userPic;

function base64Encoder() {
	// https://stackoverflow.com/questions/17710147/image-convert-to-base64
	if (this.files && this.files[0]) {
		let FR = new FileReader();

		FR.addEventListener("load", (e) => {
			userPic = e.target.result;
			console.log("file base64-encoded");
		});

		FR.readAsDataURL(this.files[0]);
	}
	ws.send(JSON.stringify({
		system: true,
		user: userName,
		avatar: "changed"
	}));
	upload_form.classList.add("hidden")
}
userpic_file.addEventListener("change", base64Encoder);


function createSystemMessage(text) {
	chat_window.insertAdjacentHTML('beforeend', '<div class="message system"><p>'+text+'</p></div>');
}

function createMeassage(data) {
	let ava = (data['avatar']!= undefined )? (data['avatar']):'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFsAAACgCAMAAABUveBxAAAAY1BMVEX///8AAADR0dH8/Pzw8PCysrLAwMD19fXGxsb4+PjMzMx1dXXV1dW7u7sSEhIuLi4iIiLi4uKMjIypqaliYmLb29tAQEBUVFRNTU1ra2uYmJjq6uo0NDSEhIShoaGSkpIaGhoXUdtRAAADyElEQVRoge2a2ZKqMBBAA8guoIAgm/r/X3mZhRDtTkigeZi6nNexTjEh6S0wdnBwcCDghP5pxg9ppNfAfcZN3b+smUtVxkMR3NZrT/Zj6C0lVZ50ptrQLppMreVkeeDoev2oLVNN76R/6i3P2dD7SxlpuO1V6pH6vJ/bsgZ/P7fV26vcWTy0rhdEUZAU+XCX2R+m7rKA26Bz4xf8pWXFBu5X48lWMUywx2903dVDeeycBDm3iicX3Jm7GJO6BspbDXe/tKW+GaA8WHYPOmrGYuC+nBbdhZ7bgWsue6rZvXyGf7jBVZGcIe7OZP8ZAC55iUdd7r7rqlkHHxyPityt+Sq/gBsRP0Hc7em7A+B+XVXu1CDT+jD/oZtscvfar3KkBO5K5VbFHIAL3yb2aJP7aeJGAjN28KefLaSQdzq44FjEmtxGNY1fAXcpd9/NSj74MlO5W5mbIDAYWsivop+/qJMqIIdubFGdb8zU7AHdRptBRQLd0uxjCowoVkLlRg4PmRvJPf+9+wzdBrlFTQTdOo2EFh50b+gQ30GSg1bFpwNy5qnUSPlzIXPDGGuUb5XA3GCUb1UgOY1seyO5GC2s1gDDIN2rhKnBMN8qgIUsWaSCbcnFeGQjA0ZBut3dAjdZEGRgB1Y0gziGBW/N9lEDcOD1Omod4Jt0qdQMxBL97nEJuEnIshnMlPIZhyE2GCfWVGoPqKUDDkP8J1gQk5ZXgeNegJrmsN9ybIa3uVnoorZBJ8KXTYmsi4o4k02ay7Wv0TnZblMhK8xpTRuwieC+MMev1r9FpJgUSZ8bIjZSBAsMm9KjYiye5huP4lW2OZpk7SvkdNhJyWLz6x3M/blN7nFxI0pdYqWa1oN3Jcvk49GpZzdZ8J8QkjldqoVusrJ9Quho6AqyX/Id3cXs1h26ayNMdsjqjwmhoCRrkyaEqo+oSpgRpi+bg9Mn3ZzOqNXM73d0V/u5Q36hSNfyTjg8oKBXCdvgAYWsCJ7hox26vpTD62GDCytd+LiLPO0IcwzDkb4O0Y5ufpNI11BDN3kqZuw0uclT8RhQpkBIni6FwRF5uhzx3B/I087BwcHBHyG0H2Vdl3lAHggdlxeEWUtrvwp98WgnuyBnyPicrpBArmypKokQm4MRdYJw7GpRlco+pib6mEIyvyO5MkM+XPmGQO3IBqUEvbcjUVMs+J9177jee+4T7EOhL0j2d4i7aepw5EsK/IO1NcDPBqyUamp1hRNqsktydv6M4JSN4Hu+7Cnz5YjLB1bpg+w+mHMu4qaMn8TPfHCwN/8AnNwmafqcwLUAAAAASUVORK5CYII=';
	chat_window.insertAdjacentHTML('beforeend', '\
<div class="message">\
	<div class="avatar">\
		<img src="' + ava + '" />\
	</div>\
	<div class="message_text">\
		<span class="nickname">' + data['user'] + '</span>\
		<p>' + data['text'] + '</p>\
	</div>\
</div>\
	');
}

function serverMessageHandler(msg) {
	let data = JSON.parse(msg);
	if (data["system"] === true)
		createSystemMessage(data["text"])
	else
		createMeassage(data);
}

var ws = new WebSocket(location.origin.replace(/^http/, 'ws'));

ws.onerror = () => location.reload();
ws.onopen = () => console.log('WebSocket connection established');
ws.onclose = () => location.reload();

ws.onmessage = (message) => {
	console.log('Server sent:', message);
	serverMessageHandler(message['data']);
}


btn_login.onclick = () => {
	userName = (login_text.value == "")?"unknown":login_text.value;
	login_div.classList.add("hidden");
	chat_div.classList.remove("hidden");
	ws.send(JSON.stringify({
		system: true,
		user: userName
	}));
}

btn_send.onclick = () => {
	if (chat_msg.value != ""){
		ws.send(JSON.stringify({
			user: userName,
			text:  chat_msg.value,
			avatar: userPic
		}));
		chat_msg.value = "";
	}
}

btn_image_upload.onclick = () => {
	upload_form.classList.remove("hidden");
}


