import artisan from "../services/artisan";
import dockerCompose from "../services/dockerCompose";
import frontendYarn from "../services/frontendYarn";
import { randomUserAttributes } from "../factories/random";
import { getButtonByText, getByLabel } from "../helpers";

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
    artisan.seedDatabase({
      users: [
        {
          id: 1,
          ...userAttributes,
        },
      ],
    });

    cy.visit("http://localhost:8000");
    getByLabel("Email Address").type(userAttributes.email);
    getByLabel("Password").type(userAttributes.password);
    getButtonByText("Log in").click();

    cy.contains("Create new timesheet");
  });
});
