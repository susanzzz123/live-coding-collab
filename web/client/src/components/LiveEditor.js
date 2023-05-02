import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import socket from '../Socket';

function LiveEditor({ name }) {
  const [code, setCode] = useState('// begin typing your code!');
  const [language, setLanguage] = useState('javascript');

  const options = ['javascript', 'python', 'cpp', 'java'];

  useEffect(() => {
    socket.on('changed_code', (change) => {
      console.log(change);
      setCode(change);
    });
    return () => {
      socket.off('changed_code');
    };
  }, []);

  // eslint-disable-next-line no-unused-vars
  const handleEditorChange = (value, event) => {
    setCode(value);
    socket.emit('code_change', name, value);
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
