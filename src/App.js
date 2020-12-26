import React, {useState, useEffect} from 'react';
import Note from './components/Note'
import noteService from './services/notes';
import './index.css'
import loginService from './services/login'
import Footer from './components/Footer'
import Notification from './components/Notification'


const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('a new note ....');
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(()=>{
    //console.log('effect');
    noteService
      .getAll()
      .then(initialNotes => setNotes(initialNotes))
  }, []);
  console.log('render ', notes.length, 'notes');


  useEffect(()=>{
    const loggedUserDataJSON = window.localStorage.getItem('loggedNoteappUser');
    if(loggedUserDataJSON){
      const userData = JSON.parse(loggedUserDataJSON);
      setUser(userData);
      noteService.setToken(userData.token);
    }
  }, []);


  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const userData = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(userData)
      );
      noteService.setToken(userData.token);
      setUser(userData);
      setUsername('');
      setPassword('');      
    } catch(exception){
      setErrorMessage('invalid credential');
      setTimeout(()=>{
        setErrorMessage(null)
      }, 5000)
    }
  }

  
  const addNote = (event) => {
    event.preventDefault();
    let noteObject = {
      content: newNote,
      date : new Date().toISOString(),
      important : Math.random()<0.5
    };
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote));
        setNewNote('');  
      })
      .catch(error => {
        setErrorMessage(error.response.data.error);
        setTimeout(()=>{
          setErrorMessage(null)
        }, 5000)
      })
  }
  
  const handleNoteChange = (event) => {
    //console.log(event.target.value);
    setNewNote(event.target.value);
  }

  let notesToShow = showAll ? notes : notes.filter(note => note.important === true);

  const toggleImportanceOf = (id) => {
    //console.log(`importance of note number ${id} needs to be changed`);
    let note = notes.find(n => n.id === id);
    let changedNote = {...note, important : !note.important};
    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(n => n.id !== id ? n : returnedNote))
      })
      .catch(error => {
        
        setErrorMessage(`the note '${note.content}' has been deleted`);
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000);
        setNotes(notes.filter(n => n.id !== id ));
      })
  }

  
  const loginForm = () => {
    return (
      <form onSubmit={handleLogin}>
        <div>
          username:
          <input
            type="text"
            name="Username"
            value={username}
            onChange={(event)=>{
              setUsername(event.target.value)
            }}
          />
        </div>
        <div>
          password:
          <input
            type="password"
            name="Password"
            value={password}
            onChange={(event)=>{
              setPassword(event.target.value)
            }}
          />
        </div>
        <button type="submit">Log in</button>
      </form>
    )
  }


  const noteForm = () => {
    return (
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type="submit">Save</button>
      </form>
    )
  }


  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser');
    noteService.setToken(null);
    setUser(null);
  }
  
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
        <button onClick={()=>setShowAll(!showAll)}>
          Show {showAll ? 'Important' : "All"}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => <Note key={note.id} note={note} toggleImportance = {()=>{toggleImportanceOf(note.id)}}/>)}
      </ul>      
      <Footer />
    </div>
  );
};


export default App;