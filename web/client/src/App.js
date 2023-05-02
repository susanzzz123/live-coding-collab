import React, { useState, useEffect } from 'react';
import LiveEditor from './components/LiveEditor';
import socket from './Socket';

function App() {
  const [name, setName] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    socket.on('joined', () => {
      console.log('SUCCESSFULLY JOINED ROOM');
    });

    socket.emit('get_all_users');
    socket.on('all_users', (users) => {
      console.log(users);
      setAllUsers(users);
    });
  }, []);

  const joinRoom = () => {
    console.log('JOINING RN');
    socket.emit('join', name);
    setShowEditor(true);
  };

  return (
    <div>
      <h1>Welcome to the Live Coding Session!</h1>
      {!showEditor && (
        <div>
          <input placeholder="Enter Your Name:" onChange={(e) => setName(e.target.value)} />
          <button type="button" onClick={() => joinRoom()} disabled={!name}>Join Room</button>
        </div>
      )}
      {showEditor && (
        <div>
          <h4>All Users Online:</h4>
          {
            allUsers.map((user, idx) => (
              <span key={idx}>
                {user}
                &nbsp;
              </span>
            ))
          }
          <LiveEditor name={name} setShowEditor={setShowEditor} />
        </div>
      )}
    </div>
  );
}

export default App;
