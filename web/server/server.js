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

const rooms = {};
io.on('connection', (socket) => {
  socket.on('create', (name, roomId) => {
    const user = { name, id: socket.id };
    const users = [user];
    rooms[roomId] = users;
    socket.join(roomId);
    socket.emit('nav_to_room', roomId);
  });

  socket.on('join', (name, id) => {
    // check for dup name
    const users = rooms[id];
    const arr = users.filter((user) => user.name === name);
    if (arr.length !== 0) {
      socket.emit('dup_username');
    } else {
      const user = { name, id: socket.id };
      users.push(user);
      socket.join(id);
      socket.emit('nav_to_room', id);
      socket.to(id).emit('joined', name);
    }
  });

  socket.on('get_all_users', (roomId) => {
    const users = rooms[roomId];
    socket.to(roomId).emit('all_users', users);
  });

  socket.on('code_change', (data) => {
    io.to(data.roomId).emit('changed_code', data.change);
  });

  socket.on('disconnect', (roomId) => {
    const users = rooms[roomId];
    const disconnectedUser = users.filter((user) => user.id === socket.id);
    const idx = users.indexOf(disconnectedUser[0]);
    users.splice(idx, 1);
    rooms[roomId] = users;
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
