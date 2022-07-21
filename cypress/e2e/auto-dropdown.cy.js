/// <reference types="cypress" />

describe('Auto Dropdown Complete', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:5500/')
  })

  it('should see heading and input field', () => {
    cy.contains('Dropdown Autocomplete')
      .should('be.visible')
    
    cy.get('[data-cy="search-input"]')
      .should('be.visible')
  })

  it('should see appropriate data when searching to server with mock', () => {
    cy.intercept('get', 'https://jsonplaceholder.typicode.com/todos', {
      fixture: 'todos.json'
    })

    cy.get('[data-cy="search-input"]').type('q')

    cy.contains('quis ut nam facilis et officia qui', { matchCase: false })
      .should('be.visible')
  })

  it('should see "not found message" when searching is not found to server with mock', () => {
    cy.intercept('get', 'https://jsonplaceholder.typicode.com/todos', {
      fixture: 'todos.json'
    })

    cy.get('[data-cy="search-input"]').type('erererer')

    cy.contains('No Data Found')
      .should('be.visible')
  })

  it('should toggle autocomplete container when searching to server with mock', () => {
    cy.intercept('get', 'https://jsonplaceholder.typicode.com/todos', {
      fixture: 'todos.json'
    })

    cy.get('[data-cy="search-input"]').type('q')

    cy.get('.autocomplete-container')
    .should('be.visible')

    cy.get('[data-cy="search-input"]').clear()

    cy.get('.autocomplete-container')
      .should('be.hidden')
  })
})