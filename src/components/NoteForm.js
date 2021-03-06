import React, { useState } from 'react';
import '../index.css';

//this component creates it's own states
//it only gets one function in props
//once the save button is pressed the form submission function
//sends the new note object to the props function

const NoteForm = ({ addNote }) => {
  const [newNote, setNewNote] = useState('');

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };

  //this function should be async and await the addNote function
  const sendNewNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: false //new notes added from the form are unimportant by default
    };
    addNote(noteObject);
    setNewNote('');
  };

  return (
    // the className and is are given for testing purpose
    <div className='formDiv'>
      <h2>Create a new note</h2>
      <form onSubmit={sendNewNote}>
        <input id='new-note-input' value={newNote} onChange={handleNoteChange}/>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};


export default NoteForm;