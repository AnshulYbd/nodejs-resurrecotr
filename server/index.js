
// server/index.js

const express = require("express");

const myroutes = require('./myroutes')
var http = require('http');


const PORT = process.env.PORT || 3001;
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/myroutes', myroutes)
app.get('/', (req, res) => {
    res.json({ message: "Hello from server!" });
    //socketio.emit('welcome', { message: 'Welcome!', id: socket.id });
})
var server = http.createServer(app).listen(PORT)
const io = require('socket.io')(server);
let socketio=undefined;
let sockets = [];

io.on('connection', client => {
    socketio=socket;
  client.on('event', data => { /* … */ });
  client.on('disconnect', () => { /* … */ });
  socket.emit('welcome', { message: 'Welcome!', id: socket.id });
});
// app.listen(PORT, () => {
//     console.log(`Server listening on ${PORT}`);
//   });

