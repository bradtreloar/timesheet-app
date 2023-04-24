describe("Homepage", () => {
  it("Displays login ", () => {
    cy.exec("docker-compose up --detach httpd");
    cy.exec("cd frontend && yarn build");
    cy.exec("cd frontend && yarn start:test");
    cy.visit("https://localhost:3000");
    cy.contains("Log in");
    cy.exec("docker-compose down");
  });
});
