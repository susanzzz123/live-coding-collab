import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import socket from '../Socket';

function LiveEditor() {
  const [code, setCode] = useState('// begin typing your code!');
  const [language, setLanguage] = useState('javascript');

  const options = ['javascript', 'python', 'cpp', 'java'];

  useEffect(() => {
    socket.on('chat room joined', (roomId) => {
      console.log(`Joined chat room ${roomId}`);
    });
  }, []);

  // eslint-disable-next-line no-unused-vars
  const handleEditorChange = (value, event) => {
    setCode(value);
  };

  return (
    <div>
      <div>Language:</div>
      <select
        onChange={(e) => {
          setLanguage(e.target.value);
          if (e.target.value === 'python') {
            setCode('# begin typing your code!');
          } else {
            setCode('// begin typing your code!');
          }
        }}
        defaultValue={language}
      >
        {
        options.map((option) => <option>{option}</option>)
      }
      </select>
      <br />
      <Editor
        height="90vh"
        theme="vs-dark"
        language={language}
        value={code}
        onChange={handleEditorChange}
      />
    </div>
  );
}

export default LiveEditor;
