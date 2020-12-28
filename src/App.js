import React, { useState, useEffect, useRef } from 'react';
import Note from './components/Note';
import noteService from './services/notes';
import './index.css';
import loginService from './services/login';
import Footer from './components/Footer';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import Togglable from './components/Togglable';
import NoteForm from './components/NoteForm';


const App = () => {
  const [notes, setNotes] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(null);
  //we will use this ref to access function defined in other components
  // i.e. components rendered inside this App component
  const noteFormRef = useRef();

  useEffect(() => {
    //console.log('effect');
    noteService
      .getAll()
      .then(initialNotes => setNotes(initialNotes));
  }, []);
  console.log('render ', notes.length, 'notes');


  useEffect(() => {
    //searching for log in info in the local storage
    const loggedUserDataJSON = window.localStorage.getItem('loggedNoteappUser');
    if(loggedUserDataJSON){
      //userData contains the token, username and name
      const userData = JSON.parse(loggedUserDataJSON);
      setUser(userData);
      //setToken will prepared a bearer token in the noteService local variable token
      noteService.setToken(userData.token);
    }
  }, []);


  const handleLogin = async (userCredentials) => {
    try {
      //userData will have the username, name and token returned from backend
      const userData = await loginService.login(userCredentials);
      //saving the userData in the local storage
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(userData)
      );
      //creating a bearer token in the noteService local variable token
      noteService.setToken(userData.token);
      setUser(userData);
    } catch(exception){
      setErrorMessage('invalid credential');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };


  const addNote = (noteObject) => {
    //we can access the toggleVisibility function defined in the Togglable
    //component from this App component because of the ref mechanism
    //details inside the Togglable component
    noteFormRef.current.toggleVisibility();
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote));
      })
      .catch(error => {
        setErrorMessage(error.response.data.error);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

  let notesToShow = showAll ? notes : notes.filter(note => note.important === true);

  const toggleImportanceOf = (id) => {
    //console.log(`importance of note number ${id} needs to be changed`);
    let note = notes.find(n => n.id === id);
    let changedNote = { ...note, important : !note.important };
    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(n => n.id !== id ? n : returnedNote));
      })
      .catch(error => {

        setErrorMessage(`the note '${note.content}' has been deleted`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter(n => n.id !== id ));
      });
  };


  const loginForm = () => {
    //the Togglable component has its opening and closing tag
    //the LoginForm component is inside it
    //LoginForm component will be available to Togglable component
    //as {props.children}
    return (
      <Togglable buttonLabel='login'>
        <LoginForm
          handleLogin={handleLogin}
        />
      </Togglable>
    );
  };


  const noteForm = () => {
    //The Togglable component has opening and closing tag
    //the NoteForm component is inside the Togglable component
    //NoteForm component will be available to the Togglable component
    //as {props.children}
    return (
      //the ref is transferred because we want to access a function
      //defined in the Togglable component from here
      //i.e. from the App component
      <Togglable buttonLabel='new note' ref={noteFormRef}>
        <NoteForm
          addNote = {addNote}
        />
      </Togglable>

    );
  };


  const handleLogout = () => {
    //clearing the local storage of the userData
    window.localStorage.removeItem('loggedNoteappUser');
    //setting the noteService local variable token to null
    noteService.setToken(null);
    setUser(null);
  };

  return(
    <div>
      <h1>NOTES</h1>
      <Notification message = {errorMessage} />
      {
        user === null ?
          loginForm() :
          <div>
            <p>{user.name} logged in</p>
            <button onClick={handleLogout}>Log Out</button>
            {noteForm()}
          </div>
      }
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          Show {showAll ? 'Important' : 'All' }
        </button>
      </div>
      <ul>
        {notesToShow.map(note => <Note key={note.id} note={note} toggleImportance = {() => {toggleImportanceOf(note.id);}}/>)}
      </ul>
      <Footer />
    </div>
  );
};


export default App;