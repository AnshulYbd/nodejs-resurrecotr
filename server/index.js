
// server/index.js

const express = require("express");

var http = require('http');
const PORT = process.env.PORT || 3001;
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const myroutes = require('./myroutes')
app.use('/myroutes', myroutes)
app.get('/', (req, res) => {
    res.json({ message: "Hello from server!" });
    //socketio.emit('welcome', { message: 'Welcome!', id: socket.id });
})
var server = http.createServer(app).listen(PORT)
// app.listen(PORT, () => {
//     console.log(`Server listening on ${PORT}`);
//   });

