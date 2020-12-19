import React, {useState, useEffect} from 'react';
import Note from './components/Note'
import noteService from './services/notes';
import './index.css'

const Notification = ({message}) => {
  if(message === null){
    return null;
  }
  return (

    <div className='error'>
      {message}
    </div>
  )
}

const Footer = () => {
  let footerStyle = {
    color:'green',
    fontStyle:'italic',
    fontSize:16
  }
  return (
    <div style={footerStyle}>
      <em>Created by Kazi Shoaib Muhammad</em>
    </div>
  )
}

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('a new note ....');
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(()=>{
    //console.log('effect');
    noteService
      .getAll()
      .then(initialNotes => setNotes(initialNotes))
  }, []);
  console.log('render ', notes.length, 'notes');

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

  return(
    <div>
      <h1>NOTES</h1>
      <Notification message = {errorMessage} />
      <div>
        <button onClick={()=>setShowAll(!showAll)}>
          Show {showAll ? 'Important' : "All"}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => <Note key={note.id} note={note} toggleImportance = {()=>{toggleImportanceOf(note.id)}}/>)}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type="submit">Save</button>
      </form>
      <Footer />
    </div>
  );
};


export default App;