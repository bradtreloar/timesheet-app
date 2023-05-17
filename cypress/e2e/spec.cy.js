import artisan from "../services/artisan";
import dockerCompose from "../services/dockerCompose";
import frontendYarn from "../services/frontendYarn";
import { randomUserAttributes } from "../factories/random";

before(() => {
  frontendYarn.buildDev();
  dockerCompose.down();
  dockerCompose.up("httpd");
});

after(() => {
  dockerCompose.down();
});

describe("Authentication", () => {
  beforeEach(() => {
    artisan.migrateFresh();
  });

  it("Logs user in and out", () => {
    const userAttributes = {
      ...randomUserAttributes(),
      isAdmin: true,
    };
    const { name, email, password } = userAttributes;
    artisan.seedDatabase({
      users: [
        {
          id: 1,
          ...userAttributes,
        },
      ],
    });

    cy.visit("http://localhost:8000");
    cy.getByLabel("Email Address").type(email);
    cy.getByLabel("Password").type(password);
    cy.getButtonByText("Log in").click();
    cy.getLinkByText(name).click();
    cy.getLinkByText("Log out").click();
    cy.contains(`${name} has logged out.`);
    cy.getButtonByText("Log in");
  });
});
