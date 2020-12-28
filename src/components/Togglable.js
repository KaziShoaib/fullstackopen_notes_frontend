import { useState, useImperativeHandle } from 'react';
import React from 'react';
import '../index.css';

//we can use PropTypes to declare that some of the props must be
//provided from the parent element
//the App component in this case
import PropTypes from 'prop-types';



//the whole component is wrapeed in a React.forwardRef function call
//because we want to access one of the functions defined here from outside
//i.e. from the App component
//the component gets a ref from the App component
const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display : visible ? 'none' : '' };
  const showWhenVisible = { display : visible ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  //the useImperative function is making sure that the
  //toggleVisibility function can be accessed from an outside component
  //i.e. from the App component
  //It is using the ref sent from the App component
  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    };
  });

  return (
    //the props.children will render all the conponents inside the opening and
    //closing tag of the Togglable component
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  );
});

//we are declaring that
// the buttonLabel prop is required
// and it should be a string
// if the buttonLabel is not provided in the props
//there will be an error in the console
Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
};

//this is necessary for eslint
//without this the Togglable component will not have any name
Togglable.displayName = 'Togglable';

export default Togglable;