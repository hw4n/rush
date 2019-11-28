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
      io.sockets.emit("update", {type:"server", name:"SERVER", message:`[!] 오류가 발생했습니다.`});
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

    io.sockets.emit("update", {type: "connect", name: "SERVER", message: `${name} 접속`, timestamp:new Date()});
    allUsers.push(socket.name);
    io.sockets.emit("userUpdate", allUsers);

    if (streamData.src) {
      socket.emit("playMusic", streamData);
    }
  });

  socket.on("message", (data) => {
    data.name = socket.name;
    data.timestamp = new Date();
    console.log(`[+] User(${data.name}) sent msg: ${data.message}`);
    socket.broadcast.emit("update", data);
    messages.push(data);

    if (data.message.substring(0, prefix.length) === prefix) {
      var parts = data.message.split(" ");
      var command = parts[0].substring(prefix.length, parts[0].length);
      var keyword = "";

      for (var i = 1; i < parts.length; i++) {
        keyword += parts[i];
        if (i + 1 !== parts.length) {
          keyword += " ";
        }
      }

      if (command === "검색") {
        if (!keyword) {
          socket.emit("update", {type:"server", name:"SERVER", message:`[!] 검색할 제목을 정확히 입력해주세요.`});
          return;
        }
  
        youtube.search(keyword, 5, (err, res) => {
          res.items.forEach((video, idx) => {
            socket.emit("update", {type:"server", name:"SERVER", message:`[${video.id.videoId}] ${video.snippet.title}`, timestamp:new Date()});
          });
        });
      }
      else if (command === "재생") {
        if (!keyword) {
          socket.emit("update", {type:"server", name:"SERVER", message:`[!] 정확한 비디오ID를 입력해주세요.`});
          return;
        }

        youtube.getById(parts[1], (err, res) => {
          if (err) {
            console.log(err);
            socket.emit("update", {type:"server", name:"SERVER", message:`[!] 유튜브 API에서 오류가 발생했습니다.`});
          }
          else if (res.items.length === 0) {
            socket.emit("update", {type:"server", name:"SERVER", message:`[!] 유튜브 ID를 확인할 수 없습니다.`});
          }
          else {
            streamData.title = res.items[0].snippet.title;
            streamData.start = new Date();
            streamData.src = parts[1];
            io.sockets.emit("update", {type:"server", name:"SERVER", message:`[♪] 재생 >> ${streamData.title}`, timestamp:new Date()});
            io.sockets.emit("playMusic", streamData);
          }
        });
      }
    }
  });

  socket.on("disconnect", () => {
    console.log(`[-] User(${socket.name}) disconnected`);
    socket.broadcast.emit("update", {type: "disconnect", name: "SERVER", message: `${socket.name} 접속 종료`, timestamp:new Date()});
    var userIdx = allUsers.indexOf(socket.name);
    allUsers.splice(userIdx, 1);
    io.sockets.emit("userUpdate", allUsers);
  });
});

server.listen(port, () => {
  console.log(`[+] Server listening at ${port}`);
});