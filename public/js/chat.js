var socket = io();
var chat = document.querySelector("#chat");
var chatInput = document.querySelector("#chatInput");
var userlist = document.querySelector("#userlist");

socket.on("connect", () => {
  var name = Math.random().toString(36).substr(2, 7);
  socket.emit("newUser", name);
  playerInit();
});

socket.on("update", (data) => {
  updateChat(data);
});

socket.on("userUpdate", (users) => {
  updateUser(users);
})

function updateUser(users) {
  userlist.innerHTML = "";

  users.forEach((user) => {
    var message = document.createElement("li");
    var text = document.createTextNode(user);
    message.appendChild(text);
    userlist.appendChild(message);
  });
}

chatInput.addEventListener("keydown", (e) => {
  disableEnterOnly(e);
});

chatInput.addEventListener("keypress", (e) => {
  disableEnterOnly(e);
});

function disableEnterOnly(e) {
  var key = e.which || e.keyCode;

  if (key == 13 && !e.shiftKey) {
    e.preventDefault();
  }
}

chatInput.addEventListener("keyup", (e) => {
  var key = e.which || e.keyCode;

  if (key == 13 && !e.shiftKey && !inputIsBlank()) {
    preprocessInput();
    send();
    clearInput();
  }
});

function inputIsBlank() {
  return chatInput.value.trim().length === 0;
}

function clearInput() {
  return chatInput.value = "";
}

function inputIsMultiline() {
  try {
    return chatInput.value.match(/\n/g).length > 0;
  } catch (e) {
    return null;
  }
}

function preprocessInput() {
  chatInput.value = chatInput.value.trim();

  if (inputIsMultiline()) {
    chatInput.value = "\n" + chatInput.value;
  }
}

function chatClasses(type) {
  switch (type) {
    case "message":
      return ["client"];

    case "server":
      return ["server"];

    case "connect":
      return ["system", "connect"];

    case "disconnect":
      return ["system", "disconnect"];
  }
}

function send() {
  var data = {type: "message", message: chatInput.value};
  socket.emit("message", data);

  data.name = "당신";
  data.timestamp = new Date();
  updateChat(data);
}

function updateChat(data) {
  var message = document.createElement("div");

  if (data.name !== "server") {
    var text = document.createTextNode(`${data.name} : ${data.message}\n`);
  } else {
    var text = document.createTextNode(`${data.message}\n`);
  }
  
  message.appendChild(createTimestampElement(data.timestamp));

  message.classList.add(...chatClasses(data.type));
  message.appendChild(text);
  
  chat.appendChild(message);

  chat.scrollTop = chat.scrollHeight;

  if (data.name == "server") {
    setTimeout(() => {
      message.classList.remove("connect");
      message.classList.remove("disconnect");
    }, 5000);
    setTimeout(() => {
      message.remove();
    }, 6000);
  }
}

function dateToTimestamp(time) {
  var date = new Date(time);
  var hour = date.getHours();
  var minute = date.getMinutes();
  var ampm = "AM";

  if (hour > 12) {
    ampm = "PM";
    hour -= 12;
  }
  if (hour < 10) {
    hour = "0" + hour;
  }
  if (minute < 10) {
    minute = "0" + minute;
  }

  return `${hour}:${minute} ${ampm}`;
}

function createTimestampElement(time) {
  if (time) {
    display = dateToTimestamp(time);
  } else {
    display = dateToTimestamp(String(new Date()));
  }
  
  var timestamp = document.createElement("span");
  var timetext = document.createTextNode(display);
  timestamp.classList.add("timestamp");
  timestamp.appendChild(timetext);
  
  return timestamp;
}

window.onbeforeunload = function(event) {
  this.socket.disconnect();
};

function clearChat() {
  chat.innerHTML = "";
}

socket.on("disconnect", () => {
  chatInput.toggleAttribute("disabled");
    var div = document.createElement("div");
    div.innerHTML = `
      <div class="overlay-content">
        <h1>연결되지 않음</h1>
        <p>서버에 연결된 상태가 아닙니다.</p>
        <button type="button" class="btn btn-lg btn-success" onclick="
          socket.connect();
          clearChat();
          chatInput.toggleAttribute('disabled');
        ">재접속</button>
      </div>
    `;
    div.classList.add("overlay", "disconnect");
    chat.prepend(div);
});