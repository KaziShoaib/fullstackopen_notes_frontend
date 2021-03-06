import React from 'react';
import '../index.css';

const Note = ({ note, toggleImportance }) => {
  let label = note.important ? 'make not important' : 'make important';
  return (
    <li className='note'>
      <span>{note.content}</span>
      <button onClick={toggleImportance}>{label}</button>
    </li>
  );
};

export default Note;