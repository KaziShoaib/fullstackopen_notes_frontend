import React, { useState } from 'react';
import '../index.css';

//we can use PropTypes to declare that some of the props must be
//provided from the parent element
//the App component in this case
import PropTypes from 'prop-types';


//this component creates it's own states
//it get one function in props
//once the log in button is pressed the login form submission function
//sends the new user credentials to the props function


const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  //this function should be async and await the handleLogin function
  const sendUserCredentials = (event) => {
    event.preventDefault();
    const userCredentials = {
      username, password
    };
    handleLogin(userCredentials);
    setUsername('');
    setPassword('');
  };

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
            onChange={(event) => {setUsername(event.target.value);}}
          />
        </div>
        <div>
          password:
          <input
            type="password"
            name="Password"
            value={password}
            onChange={(event) => {setPassword(event.target.value);}}
          />
        </div>
        <button type="submit">Log in</button>
      </form>
    </div>
  );
};



//we are declaring that
// the handleLogin prop is required
// and it should be a function
// if the handleLogin is not provided in the props
//there will be an error in the console
LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired
};

export default LoginForm;