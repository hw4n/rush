var player = document.querySelector("#streamPlayer");
var nowPlaying = document.querySelector("#nowPlaying");
var volumeControl = document.querySelector("#volumeControl");

var playing = {
  src: "",
  title: "",
  start: ""
}

socket.on("playMusic", (streamData) => {
  if (!streamData) {
    return;
  }

  setStreamData(streamData);
  player.load();
});

player.addEventListener('loadeddata', () => {
  player.play();
}, false);

player.addEventListener("play", () => {
  nowPlaying.innerText = playing.title;
  player.currentTime = getCurrentSeekPos();
});

player.addEventListener("playing", () => {
  if (getCurrentSeekPos() > player.duration) {
    resetPlayer();
  }
});

socket.on("unplayable", () => {
  nowPlaying.innerText = "재생할 수 없는 영상입니다.";
  setTimeout(() => {
    resetPlayer();
  }, 3000);
});

player.addEventListener("ended", () => {
  resetPlayer();
});

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