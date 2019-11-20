var express = require("express"),
    app     = express(),
    server  = require("http").createServer(app),
    io      = require("socket.io").listen(server);

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/chat", (req, res) => {
  res.render("chat");
});

io.sockets.on("connection", (socket) => {
  socket.on("newUser", (name) => {
    console.log(`[+] User(${name}) connected`);
    socket.name = name;
    io.sockets.emit("update", {type: "connect", name: "SERVER", message: name + " 접속"});
  });

  socket.on("message", (data) => {
    data.name = socket.name;
    console.log(`[+] User(${data.name}) sent msg: ${data.message}`);
    socket.broadcast.emit("update", data);
  });

  socket.on("disconnect", () => {
    console.log(`[-] User(${socket.name}) disconnected`);
    socket.broadcast.emit("update", {type: "disconnect", name: "SERVER", message: socket.name + " 접속 종료"});
  });
  
});

server.listen(8080, () => {
  console.log("[+] Server started");
});