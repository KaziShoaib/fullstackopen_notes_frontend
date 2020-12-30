//it is advised not to use arrow functions here

//this is a custom cypress command for logging in
//by directly sending post request to the backend
//the command also saves token and other data returned
//from the backend login router in the windows local storage
//then reloads the page
Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3001/api/login', { username, password })
    .then(({ body }) => {
      localStorage.setItem( 'loggedNoteappUser', JSON.stringify(body) );
      cy.visit('http://localhost:3000');
    });
});


//this is another custom cypress command for addin a new note
//by directly sending POST request to the backend
//the command uses the token saved in the windows local storage
//to create a bearer authorization token
//then reloads the page
Cypress.Commands.add('createNote', ({ content, important }) => {
  cy.request({
    url:'http://localhost:3001/api/notes',
    method:'POST',
    body:{ content, important },
    headers: {
      'Authorization':`bearer ${JSON.parse(localStorage.getItem('loggedNoteappUser')).token}`
    }
  });
  cy.visit('http://localhost:3000');
});


describe('Note app', function() {

  beforeEach(function(){
    //sending post request to the backend for removing all users
    //and notes from the test database
    cy.request('POST','http://localhost:3001/api/testing/reset');
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    };
    //sending post request to the backend for adding a new user
    cy.request('POST', 'http://localhost:3001/api/users', user);
    cy.visit('http://localhost:3000');
  });


  it('front page can be openend', function(){
    cy.contains('NOTES');
    cy.contains('Created by Kazi Shoaib Muhammad');
  });


  it('login form can be opened', function(){
    //this loginbutton is from the Togglable component
    cy.contains('login').click();
  });


  it('user can login', function(){
    //this loginbutton is from the Togglable component
    cy.contains('login').click();
    cy.get('#username').type('mluukkai');
    cy.get('#password').type('salainen');
    //this login button is from the LoginFrom component
    cy.get('#login-button').click();
    cy.contains('Matti Luukkainen logged in');
  });


  it('login fails with wrong password', function(){
    //this loginbutton is from the Togglable component
    cy.contains('login').click();
    cy.get('#username').type('mluukkai');
    cy.get('#password').type('wrong');
    //this login button is from the LoginForm component
    cy.get('#login-button').click();

    cy.get('.error')
      .should('contain', 'invalid credential')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid');

    cy.get('html').should('not.contain', 'Matti Luukkainen logged in');
  });


  //this describe block is inside the top describe block
  describe('when logged in', function(){

    beforeEach(function(){
      //we are using the login custom command defined above
      cy.login({ username:'mluukkai', password:'salainen' });
    });


    it('a new note can be created', function(){
      cy.contains('add new note').click();
      cy.get('#new-note-input').type('a new note from cypress');
      cy.contains('Save').click();
      cy.contains('a new note from cypress');
    });


    //this describe block is nested insided two outer describe block
    describe('and a note exists', function(){

      beforeEach(function(){
        cy.createNote({ content:'first note', important:false });
        cy.createNote({ content:'second note', important:false });
        cy.createNote({ content:'third note', important:false });
      });


      it('notes can be made important', function(){
        cy.contains('second note').parent().find('button').as('theButton');
        cy.get('@theButton').click();
        cy.get('@theButton').should('contain', 'make not important');
      });
    });

  });

});
