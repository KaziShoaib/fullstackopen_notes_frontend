import React, { useState } from 'react'
import '../index.css'

//this component creates it's own states
//it get one function in props
//once the log in button is pressed the login form submission function
//sends the new user credentials to the props function


const LoginForm = ({handleLogin}) => {  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const sendUserCredentials = (event) => {
    event.preventDefault();
    const userCredentials = {
      username, password
    }
    handleLogin(userCredentials);
    setUsername('');
    setPassword('');
  }
  
  return (
    <div>
      <h2>Log In</h2>
      <form onSubmit={sendUserCredentials}>
      <div>
          username:
          <input
            type="text"
            name="Username"
            value={username}
            onChange={(event)=>{setUsername(event.target.value)}}
          />
        </div>
        <div>
          password:
          <input
            type="password"
            name="Password"
            value={password}
            onChange={(event)=>{setPassword(event.target.value)}}
          />
        </div>
        <button type="submit">Log in</button>
      </form>
    </div>
  )
}


export default LoginForm