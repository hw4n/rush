var player = document.querySelector("#streamPlayer");
var nowPlaying = document.querySelector("#nowPlaying");
var volumeControl = document.querySelector("#volumeControl");
var musicQueueList = document.querySelector("#musicQueue");

var playing = {
  src: "",
  title: "",
  start: ""
}

socket.on("playMusic", (music) => {
  setStreamData(music);
  player.load();
});

socket.on("updateQueue", (musics) => {
  if (!musics) {
    return;
  }

  if (!player.nowPlaying) {
    setStreamData(musics[0]);
    player.load();
  }

  updateQueue(musics);
});

function updateQueue(queue) {
  musicQueueList.innerHTML = "";

  for (var i = 1; i < queue.length; i++) {
    var li = document.createElement("li");
    var text = document.createTextNode(queue[i].title);
    li.appendChild(text);
    musicQueueList.appendChild(li);
  };
}

player.addEventListener('loadeddata', () => {
  player.play();
}, false);

player.addEventListener("play", () => {
  nowPlaying.innerText = playing.title;
  player.currentTime = getCurrentSeekPos();
});

player.addEventListener("playing", () => {
  if (musicIsOver()) {
    resetPlayer();
  } else {
    player.nowPlaying = true;
  }
});

socket.on("unplayable", () => {
  nowPlaying.innerText = "재생할 수 없는 영상입니다.";
  socket.emit("musicDone", playing.src.substring(7,));
});

player.addEventListener("ended", () => {
  socket.emit("musicDone", playing.src.substring(7,));

  resetPlayer();
});

function musicIsOver() {
  if (getCurrentSeekPos() > player.duration) {
    return true;
  } else {
    return false;
  }
}

function setStreamData(streamData) {
  playing.src = `/music/${streamData.src}`;
  playing.title = streamData.title;
  playing.start = streamData.start;

  player.src = playing.src;
}

function getCurrentSeekPos() {
  return Math.abs(Date.parse(playing.start) - new Date()) / 1000;
}

function resetPlayer() {
  nowPlaying.innerText = "재생 중이 아닙니다.";
  player.src = "";
  player.pause();
  player.nowPlaying = false;
}

function playerInit() {
  player.controls = false;
  player.muted = false;
  player.volume = 0.5;
  resetPlayer();
}

volumeControl.oninput = () => {
  player.volume = Number(volumeControl.value) / 100;
}