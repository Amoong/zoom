import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", `${__dirname}/views`);
app.use("/static", express.static(`${__dirname}/static`));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
// server 전달은 필수가 아님, http와 wss 서버를 동시에 돌리고 싶을 때 사용
// http 서버 위에 wss 서버가 돌아간다.
// http 서버를 돌리는 이유는 GET 요청 같은걸 처리하기 위해서
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anon";
  console.log("Connected to Browser ✅");
  socket.on("close", () => console.log("Disconnected from the Browser ❌"));
  socket.on("message", (msg) => {
    const message = JSON.parse(msg.toString());

    switch (message.type) {
      case "new_message":
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname}: ${message.payload}`)
        );
        break;
      case "nickname":
        socket["nickname"] = message.payload;
        console.log(message.payload);
        break;
    }
  });
});

server.listen(3000, handleListen);
