//test command -> set CI=true && npm test
//test coverage -> set CI=true && npm test -- --coverage
//report can be found on coverage/lcov-report

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import { prettyDOM } from '@testing-library/dom';
import Note from './Note';

describe('tests for <Note />', () => {

  test ('renders content', () => {
    const note = {
      content: 'component testing is done with react-testing-library',
      important: true
    };

    const component = render (
      <Note note={note} />
    );

    component.debug(); //this will print all the html of the whole component

    const li = component.container.querySelector('li');
    console.log(prettyDOM(li));

    //method 1
    //the container property contains all the HTML renderd by a component
    expect(component.container).toHaveTextContent(note.content);

    //method 2
    //getByText returns an element from the component
    //that contains a matching text
    const element = component.getByText(note.content);
    expect(element).toBeDefined();

    //method 3
    //the query selector returns an element from the component
    //with class .note
    const div = component.container.querySelector('.note');
    expect(div).toHaveTextContent(note.content);
  });


  test('clicking the button calls the event handler once', () => {
    const note = {
      content: 'component testing is done with react-testing-library',
      important: true
    };

    const mockHandler = jest.fn();

    const component = render (
      <Note note={note} toggleImportance={mockHandler}/>
    );

    const button = component.getByText('make not important');
    fireEvent.click(button); //clicking the button

    //testing that the mockHandler function was called exactly once
    expect(mockHandler.mock.calls).toHaveLength(1);
  });

});
