import React, { useState, useEffect } from 'react';
import socket from '../Socket';
import LiveEditor from './LiveEditor';

function Room({ name }) {
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    socket.emit('get_all_users');
    socket.on('all_users', (users) => {
      setAllUsers(users);
    });
  }, []);
  return (
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
      <LiveEditor name={name} />
    </div>
  );
}

export default Room;
