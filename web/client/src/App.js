import React, { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import LiveEditor from './components/LiveEditor';
import socket from './Socket';

function App() {
  const [name, setName] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [changeName, setChangeName] = useState(false);

  useEffect(() => {
    socket.emit('get_all_users');
    socket.on('all_users', (users) => {
      setAllUsers(users);
    });
    socket.on('dup_username', () => {
      setChangeName(true);
    });

    socket.on('joined', () => {
      setChangeName(false);
      setShowEditor(true);
    });
  });

  const joinRoom = () => {
    socket.emit('join', name);
  };

  return (
    <div>
      <NavBar />
      {
        changeName && (
          <h4 style={{ color: 'red' }}>Username has been taken!</h4>
        )
      }
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
            allUsers.map((user) => (
              <span key={user.id}>
                {user.name}
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
