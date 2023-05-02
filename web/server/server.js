const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('dist')); // set the static folder
app.use(cors({ origin: 'http://localhost:1234' }));

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:1234',
    methods: ['GET', 'POST'],
  },
});

const users = [];
io.on('connection', (socket) => {
  socket.on('join', (name) => {
    // check for dup name
    const user = { name, id: socket.id };
    users.push(user);
    socket.emit('joined');
    console.log(users);
  });

  socket.on('get_all_users', () => {
    socket.emit('all_users', users);
  });

  socket.on('code_change', (name, change) => {
    console.log(change);
    socket.emit('changed_code', change);
  });

  socket.on('disconnect', () => {
    const disconnectedUser = users.filter((user) => user.id === socket.id);
    console.log('i disconnected');
    const idx = users.indexOf(disconnectedUser[0]);
    users.splice(idx, 1);
  });
});

server.listen(port, process.env.HOST, () => {
  console.log(`Listening on port ${port}`);
});

// set favicon
app.get('/favicon.ico', (req, res) => {
  res.status(404).send();
});

// set the initial entry point
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});
