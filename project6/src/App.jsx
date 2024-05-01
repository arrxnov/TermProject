import React, { useState } from 'react';
import Student from './Student';
import Faculty from './Faculty';
import Login from './Login';

function App() {
  const [token, setToken] = useState();
  const [role, setRole] = useState();

  if(!token) {
    return <Login setToken={setToken} setRole={setRole} />
  }

  if (role == "Faculty") {
    return (
      <Faculty />
    );
  }

  else if (role == "Student") {
    return (
      <Student />
    );
  }
}

export default App;
