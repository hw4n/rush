var socket = io();
var chat = document.querySelector("#chat");
var chatInput = document.querySelector("#chatInput");

socket.on("connect", () => {
  var name = Math.random().toString(36).substr(2, 7);
  socket.emit("newUser", name);
});

socket.on("update", (data) => {
  var message = document.createElement("div");
  var text = document.createTextNode(`${data.name}: ${data.message}\n`);
  var msgClass = "";

  switch (data.type) {
    case "message":
      msgClass = ["users"];
      break;
    case "connect":
      msgClass = ["system", "connect"];
      break;
    case "disconnect":
      msgClass = ["system", "disconnect"];
      break;
  }

  message.classList.add(...msgClass);
  message.appendChild(text);
  chat.appendChild(message);
});

function send() {
  socket.emit("message", {type: "message", message: chatInput.value});

  var message = document.createElement("div");
  var text = document.createTextNode(chatInput.value);

  message.classList.add("client");
  message.appendChild(text);
  chat.appendChild(message);
  
  chatInput.value = "";
}

chatInput.addEventListener("keypress", (e) => {
  var key = e.which || e.keyCode;
  if (key == 13) // 'Enter'
    send();
});