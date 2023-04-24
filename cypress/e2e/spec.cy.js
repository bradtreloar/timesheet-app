describe("Homepage", () => {
  it("Displays login ", () => {
    cy.exec("cd frontend && yarn build:dev");
    cy.exec("docker-compose up --detach httpd");
    cy.visit("http://localhost:8000");
    cy.contains("Log in");
    cy.exec("docker-compose down");
  });
});
