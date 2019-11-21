var socket = io();
var chat = document.querySelector("#chat");
var chatInput = document.querySelector("#chatInput");
var userlist = document.querySelector("#userlist");

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
      msgClass = ["client"];
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

  checkAndRemoveChat();
});

socket.on("userUpdate", (allUsers) => {
  userlist.innerHTML = "";

  allUsers.forEach((user) => {
    var message = document.createElement("li");
    var text = document.createTextNode(user);
    message.appendChild(text);
    userlist.appendChild(message);
  });
})

function send() {
  if (!chatInput.value.length) {
    return;
  }
  
  socket.emit("message", {type: "message", message: chatInput.value});

  var message = document.createElement("div");
  var text = document.createTextNode(chatInput.value);

  message.classList.add("client", "local");
  message.appendChild(text);
  chat.appendChild(message);
  
  chatInput.value = "";

  checkAndRemoveChat();
}

chatInput.addEventListener("keypress", (e) => {
  var key = e.which || e.keyCode;
  if (key == 13) // 'Enter'
    send();
});

function checkAndRemoveChat() {
  if (chat.childElementCount > 21) {
    chat.removeChild(chat.childNodes[0]);
  }
}