var express = require("express"),
    app     = express(),
    server  = require("http").createServer(app),
    io      = require("socket.io").listen(server);
    youtubeAudioStream = require('@isolution/youtube-audio-stream'),
    Youtube = require('youtube-node'),
    youtube = new Youtube();

youtube.setKey(process.env.APIKEY);
const port = process.env.PORT || 8080;

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/chat", (req, res) => {
  res.render("chat");
});

var streamData = {
  start: "",
  src: "",
  title: ""
};

app.get("/music/:videoId", (req, res) => {
  const requestUrl = `http://youtube.com/watch?v=${req.params.videoId}`;
  const streamPromise = youtubeAudioStream(requestUrl);
  streamPromise
    .then((stream) => {
      stream.emitter.on('error', (err) => {
        // console.log(err);
        streamData.src = "";
        io.sockets.emit("unplayable");
      });
      stream.pipe(res);
    })
    .catch((err) => {
      console.log(err);
      io.sockets.emit("update", new ServerMessage("[!] 오류가 발생했습니다."));
  });
});

var allUsers = [];
var prefix = "!";
var messages = [];

io.sockets.on("connection", (socket) => {
  socket.on("newUser", (name) => {
    console.log(`[+] User(${name}) connected`);
    socket.name = name;

    if (messages.length > 30) {
      messages.shift();
    }
    messages.forEach((data) => {
      socket.emit("update", data);
    });

    io.sockets.emit("update", new Message("connect", "server", `${name} 접속`));
    allUsers.push(socket.name);
    io.sockets.emit("userUpdate", allUsers);

    if (streamData.src) {
      socket.emit("playMusic", streamData);
    }
  });

  socket.on("message", (data) => {
    data.name = socket.name;
    data.timestamp = new Date();
    socket.broadcast.emit("update", data);
    console.log(`[+] User(${data.name}) sent msg: ${data.message}`);
    messages.push(data);

    command = commandParse(data);

    if (!command) {
      return;
    }

    if (!command.param) {
      socket.emit("update", new ServerMessage("명령어 매개변수가 입력되지 않았습니다."));
    }

    switch (command.work) {
      case "검색":
        youtube.search(command.param, 5, (err, res) => {
          res.items.forEach((video, idx) => {
            socket.emit("update", new ServerMessage(`[${video.id.videoId}] ${video.snippet.title}`));
          });
        });
        break;
      case "재생":
        youtube.getById(command.param, (err, res) => {
          if (err) {
            console.log(err);
            socket.emit("update", new ServerMessage("[!] 유튜브 API에서 오류가 발생했습니다."));
          }
          else if (res.items.length === 0) {
            socket.emit("update", new ServerMessage("[!] 유튜브 ID를 확인할 수 없습니다."));
          }
          else {
            streamData.title = res.items[0].snippet.title;
            streamData.start = new Date();
            streamData.src = command.param;
            io.sockets.emit("update", new Message("server", "server", `[♪] 재생 >> ${streamData.title}`));
            io.sockets.emit("playMusic", streamData);
          }
        });
        break;
    }
  });

  socket.on("disconnect", () => {
    console.log(`[-] User(${socket.name}) disconnected`);
    socket.broadcast.emit("update", new Message("disconnect", "server", `${socket.name} 접속 종료`));
    var userIdx = allUsers.indexOf(socket.name);
    allUsers.splice(userIdx, 1);
    io.sockets.emit("userUpdate", allUsers);
  });
});

server.listen(port, () => {
  console.log(`[+] Server listening at ${port}`);
});

function Message(type, name, message) {
  this.type = type;
  this.name = name;
  this.message = message;
  this.timestamp = new Date();
}

function ServerMessage(message) {
  return new Message("server", "server", message);
}

function commandParse(data) {
  if (data.message.substring(0, prefix.length) === prefix) {
    var parts = data.message.split(" ");
    var work = parts[0].substring(prefix.length, parts[0].length);
    var param = "";

    for (var i = 1; i < parts.length; i++) {
      param += parts[i];
      if (i + 1 !== parts.length) {
        param += " ";
      }
    }

    return {work, param};
  } else {
    return null;
  }
}