import artisan from "../services/artisan";
import dockerCompose from "../services/dockerCompose";
import frontendYarn from "../services/frontendYarn";
import { randomUserAttributes } from "../factories/random";
import { BASE_URL } from "../settings";
import { commonHooks } from "../helpers";

commonHooks();

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

  cy.visit(BASE_URL);
  cy.submitLoginForm(email, password);
  cy.getLinkByText(name).click();
  cy.getLinkByText("Log out").click();
  cy.contains(`${name} has logged out.`);
  cy.getButtonByText("Log in");
});
