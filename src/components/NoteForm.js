import React, { useState } from 'react'
import '../index.css'

//this component creates it's own states
//it only gets one function in props
//once the save button is pressed the form submission function 
//sends the new note object to the props function

const NoteForm = ({addNote}) => {
  const [newNote, setNewNote] = useState('');

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  }

  const sendNewNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5
    }
    addNote(noteObject);
    setNewNote('');
  }

  return (
    <div>
      <h2>Create a new note</h2>
      <form onSubmit={sendNewNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type="submit">Save</button>
      </form>
    </div>
  )
}


export default NoteForm