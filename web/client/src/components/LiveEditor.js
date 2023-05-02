import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import socket from '../Socket';

function LiveEditor({ name, setShowEditor }) {
  const [code, setCode] = useState('// begin typing your code!');
  const [language, setLanguage] = useState('javascript');

  const options = ['javascript', 'python', 'cpp', 'java'];

  useEffect(() => {
    socket.on('changed_code', (name, change) => {
      console.log(change);
      setCode(change);
    });
  });

  // eslint-disable-next-line no-unused-vars
  const handleEditorChange = (value, event) => {
    setCode(value);
    socket.emit('code_change', name, value);
  };

  const disconnect = () => {
    socket.emit('disconnect', name);
    setShowEditor(false);
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
        options.map((option, idx) => <option key={idx}>{option}</option>)
      }
      </select>
      <button type="button" onClick={() => disconnect()}>Exit</button>
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
