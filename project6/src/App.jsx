import React, { useState } from 'react';
import Ape from './Ape'
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
      <Ape />
    );
  }
}

export default App;
