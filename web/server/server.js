const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const redis = require('redis');
const redisAdapter = require('socket.io-redis');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('dist')); // set the static folder
app.use(cors());

app.get('/', (req, res) => {
  res.send({ msg: 'hi' });
});

const redisClient = redis.createClient();
const io = require('socket.io')(server, {
  cors: {
    origin: 'https://localhost:1234',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});

io.adapter(redisAdapter({ pubClient: redisClient, subClient: redisClient }));

io.on('connection', async (socket) => {
  socket.on('JOIN', (username) => {
    redisClient.set(socket.id, username);
  });

  socket.on('CODE_CHANGE', (change) => {
    socket.emit('changed code', socket.id, change);
  });

  // When a user disconnects, remove their username from Redis
  socket.on('DISCONNECT', (username) => {
    redisClient.del(username);
  });

  // Emit the list of usernames to all connected users
  const emitUserList = async () => {
    const socketIds = await redisClient.keys('*');
    const usernames = await Promise.all(socketIds.map((id) => redisClient.get(id)));
    io.emit('user list', usernames);
  };
  emitUserList();
});

// set favicon
app.get('/favicon.ico', (req, res) => {
  res.status(404).send();
});

// set the initial entry point
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
