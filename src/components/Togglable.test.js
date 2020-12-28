//test command -> set CI=true && npm test
//test coverage -> set CI=true && npm test -- --coverage
//report can be found on coverage/lcov-report

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import Togglable from './Togglable';

describe('Tests for <Togglable />', () => {

  let component;

  beforeEach(() => {
    component = render(
      <Togglable buttonLabel='show...'>
        <div className='testDiv'/>
      </Togglable>
    );
  });


  test('renders its children', () => {
    expect(component.container.querySelector('.testDiv')).toBeDefined();
  });


  test('at start the children are not displayed', () => {
    const div = component.container.querySelector('.togglableContent');
    expect(div).toHaveStyle('display : none');
  });


  test('after clicking the button the children are displayed', () => {
    const showButton = component.getByText('show...');
    fireEvent.click(showButton);

    const div = component.container.querySelector('.togglableContent');
    expect(div).not.toHaveStyle('display : none');
  });


  test('toggled content can be closed', () => {
    const showButton = component.getByText('show...');
    fireEvent.click(showButton);

    const cancelButton = component.getByText('cancel');
    fireEvent.click(cancelButton);

    const div = component.container.querySelector('.togglableContent');
    expect(div).toHaveStyle('display : none');
  });
});
