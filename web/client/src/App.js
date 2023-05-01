import React, { useState } from 'react';
import LiveEditor from './components/LiveEditor';
import socket from './Socket';

function App() {
  const [name, setName] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const joinRoom = () => {
    setShowEditor(true);
  };

  return (
    <div>
      <h1>Welcome to the Live Coding Session!</h1>
      {!showEditor && (
        <div>
          <input placeholder="Enter Your Name:" onChange={(e) => setName(e.target.value)} />
          <button type="button" onClick={() => joinRoom()} disabled={name}>Join Room</button>
        </div>
      )}
      {showEditor && (
      <LiveEditor />
      )}
    </div>
  );
}

export default App;
