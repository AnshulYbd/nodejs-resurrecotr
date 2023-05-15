
const express = require("express");

//const SocketService = require('./websocket.js')

var http = require('http');
const PORT = process.env.PORT || 3001;
const app = express();
const server = http.createServer(app);


var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// var server = http.createServer(function(req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('okay');
// });

/* setup socket.io */
// var io = require('socket.io');
// io = io(server);
// app.use(function(req, res, next) {
//   req.io = io;
//   next();
// });

// io.on("connection", (socket) => {
//   socket.on("chat message", (msg) => {
//     io.emit("chat message", msg);
//   });
// });

const myroutes = require('./myroutes')
app.use('/myroutes', myroutes)
// app.get('/', (req, res) => {
//     res.json({ message: "Hello from server!" });
//     //socketio.emit('welcome', { message: 'Welcome!', id: socket.id });
// })
app.get('/', (req, res) => {
    res.json({ message: "Hello from server!" });
  });

server.listen(3000, () => {
  console.log("listening on *:3000");
});

//app.set("socketService", new SocketService(server));