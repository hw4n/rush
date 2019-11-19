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
  console.log("[+] User connected");

  socket.on("send", (data) => {
    console.log("[+] User sent msg: " + data.msg);
  });

  socket.on("disconnect", () => {
    console.log("[-] User disconnected");
  });
  
});

server.listen(8080, () => {
  console.log("[+] Server started");
});