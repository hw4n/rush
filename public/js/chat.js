var socket = io();
var chatbox = document.querySelector("#chatbox");

socket.on("connect", () => {
  chatbox.value = "connected";
});

function send() {
  socket.emit("send", {msg: chatbox.value});
  chatbox.value = "";
}

chatbox.addEventListener("keypress", (e) => {
  var key = e.which || e.keyCode;
  if (key == 13) // 'Enter'
    send();
});