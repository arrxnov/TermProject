import React, { useState } from 'react';
import PropTypes from 'prop-types';

async function loginUser(credentials) {
    console.log(JSON.stringify(credentials)); // FIXME

    return fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
}
  
export default function Login({ setToken, setRole }) {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        const response = await loginUser({
        username,
        password
        });
        console.log(response); // FIXME
        setToken(response.sessionId);
        setRole(response.role);
    }

    return(
        <div className="login-wrapper">
        <h1>Please Log In</h1>
        <form onSubmit={handleSubmit}>
            <label>
            <p>Username</p>
            <input type="text" onChange={e => setUserName(e.target.value)} />
            </label>
            <label>
            <p>Password</p>
            <input type="password" onChange={e => setPassword(e.target.value)} />
            </label>
            <div>
            <button type="submit">Submit</button>
            </div>
        </form>
        </div>
    )
}
  
Login.propTypes = {
    setToken: PropTypes.func.isRequired,
    setRole: PropTypes.func.isRequired
};