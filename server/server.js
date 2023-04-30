const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const { createClient } = require('redis');
const { v4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

const client = createClient();
client.on('error', console.error);
client
  .connect()
  .then(() => console.log('Connected to redis locally!'))
  .catch(() => {
    console.error('Error connecting to redis');
  });

app.use(express.json());
app.use(express.static('dist')); // set the static folder
app.use(cors());

app.get('/', (req, res) => {
  res.send({ msg: 'hi' });
});

app.post('/create-room-with-user', async (req, res) => {
  const { username } = req.body;
  const roomId = v4();

  await client
    .hSet(`${roomId}:info`, {
      created: new Date(),
      updated: new Date(),
    })
    .catch((err) => {
      console.error(1, err);
    });

  // await client.lSet(`${roomId}:users`, [])

  res.status(201).send({ roomId });
});

const io = require('socket.io')(server, {
  cors: {
    origin: 'https://localhost:1234',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});

io.on('connection', async (socket) => {
  socket.on('JOIN_ROOM', (data) => {
    socket.join(data);
  });

  socket.on('DISSCONNECT_FROM_ROOM', async ({ roomId, username }) => {});
  socket.on('CODE_CHANGE', (data) => {
    console.log(data);
    // db.send_message(
    //   data.room,
    //   data.author,
    //   data.message,
    //   data.time,
    //   (err, data2) => {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       io.to(data.room).emit('receive_message', data);
    //     }
    //   },
    // );
  });
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
