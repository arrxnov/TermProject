import { useState } from 'react';

export default function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem('ape_session');
    return tokenString;
  };

  const [token, setToken] = useState(getToken());

  const saveToken = userToken => {
    localStorage.setItem('ape_session', userToken);
    setToken(userToken);
  };

  return {
    setToken: saveToken,
    token
  }
}