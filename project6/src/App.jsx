import React, { useState, useEffect } from 'react';
import Ape from './Ape'
import Login from './Login';
import useToken from './useToken';

export default function App() {
  const { token, setToken } = useToken();
  const [role, setRole] = useState();

  useEffect(() => {
    const checkAuth = async () => {
        const response = await fetch("http://localhost:3000/auth/checklogin", {credentials: "include"});
        const result = await response.json();
        if (result.authenticated) {
          setRole(result.role);
        }
    };

    checkAuth();
  }, []);

  if(!token) {
    return <Login setToken={setToken} />
  }

  if (role == "Faculty") {
    return (
      <Ape />
    );
  }

  else if (role == "Student") {
    return (
      <Ape />
    );
  }
}
