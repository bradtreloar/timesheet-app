// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("getByLabel", (label) =>
  cy
    .contains("label", label)
    .invoke("attr", "for")
    .then((id) => {
      cy.get("#" + id);
    })
);

Cypress.Commands.add("getButtonByText", (text) => cy.contains("button", text));

Cypress.Commands.add("getLinkByText", (text) => cy.contains("a", text));

Cypress.Commands.add("submitLoginForm", (email, password) => {
  cy.getByLabel("Email Address").type(email);
  cy.getByLabel("Password").type(password);
  cy.getButtonByText("Log in").click();
});
