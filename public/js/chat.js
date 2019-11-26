var socket = io();
var chat = document.querySelector("#chat");
var chatInput = document.querySelector("#chatInput");
var userlist = document.querySelector("#userlist");
var player = document.querySelector("#streamPlayer");
var nowPlaying = document.querySelector("#nowPlaying");

socket.on("connect", () => {
  var name = Math.random().toString(36).substr(2, 7);
  socket.emit("newUser", name);
});

socket.on("update", (data) => {
  var message = document.createElement("div");
  var text;
  if (data.name !== "SERVER")
    text = document.createTextNode(`${data.name} : ${data.message}\n`);
  else
    text = document.createTextNode(`${data.message}\n`);
  var msgClass = "";

  switch (data.type) {
    case "message":
      msgClass = ["client"];
      break;
    case "server":
      msgClass = ["server"];
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

  updateChat();
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

var playing = {
  src: "",
  title: "",
  start: ""
}

socket.on("playMusic", (streamData) => {
  if (!streamData)
    return;

  playing.src = `/music/${streamData.lastPlaying}`;
  playing.title = streamData.title;
  playing.start = streamData.streamStarted;

  player.src = playing.src;
  player.load();
});

player.addEventListener('loadeddata', () => {
  player.play();
}, false);

player.addEventListener("play", () => {
  var playerPos = Math.abs(Date.parse(playing.start) - new Date()) / 1000;
  nowPlaying.innerText = playing.title;
  player.currentTime = playerPos;
});

player.addEventListener("playing", () => {
  var playerPos = Math.abs(Date.parse(playing.start) - new Date()) / 1000;
  if (playerPos > player.duration) {
    resetPlayer();
  }
});

// socket.on("playMusic", (data) => {
//   player.setAttribute("src", `/music/${data.videoId}`);
//   nowPlaying.innerText = data.title;
// });

player.addEventListener("ended", () => {
  resetPlayer();
});

function resetPlayer() {
  nowPlaying.innerText = "재생 중이 아닙니다.";
  player.pause();
}

function send() {
  chatInput.value = chatInput.value.trim();

  if (inputIsBlank()) {
    return;
  }

  if (inputIsMultiline()) {
    chatInput.value = "\n" + chatInput.value;
  }
  
  socket.emit("message", {type: "message", message: chatInput.value});

  var message = document.createElement("div");
  var text = document.createTextNode("당신 : " + chatInput.value);

  message.classList.add("client");
  message.appendChild(text);
  chat.appendChild(message);
}

chatInput.addEventListener("keydown", (e) => {
  var key = e.which || e.keyCode;

  if (key == 13 && !e.shiftKey) {
    send();
  }
});

chatInput.addEventListener("keyup", (e) => {
  var key = e.which || e.keyCode;

  if (key == 13 && !e.shiftKey) {
    clearInput();
    updateChat();
  }
});

function checkAndRemoveChat() {
  // if (chat.childElementCount > 21) {
  //   chat.removeChild(chat.childNodes[0]);
  // }
}

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

function updateChat() {
  checkAndRemoveChat();
  chat.scrollTop = chat.scrollHeight;
}

player.controls = false;
player.muted = false;
player.volume = 0.5;

setInterval(() => {
  console.log(player.duration);
}, 500);