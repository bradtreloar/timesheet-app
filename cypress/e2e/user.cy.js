import artisan from "../services/artisan";
import dockerCompose from "../services/dockerCompose";
import frontendYarn from "../services/frontendYarn";
import { randomUserAttributes } from "../factories/random";
import { BASE_URL } from "../settings";
import { commonHooks } from "../helpers";

commonHooks();

it("Change account details", () => {
  const userAttributes = {
    ...randomUserAttributes(),
    isAdmin: false,
  };
  const { name: oldName, email: oldEmail, password } = userAttributes;
  const {
    name: newName,
    email: newEmail,
    phoneNumber: newPhoneNumber,
  } = randomUserAttributes();
  artisan.seedDatabase({
    users: [
      {
        id: 1,
        ...userAttributes,
      },
    ],
  });

  cy.visit(BASE_URL);
  cy.submitLoginForm(oldEmail, password);
  cy.getLinkByText(oldName).click();
  cy.getLinkByText("Settings").click();
  cy.getByLabel("Name").clear();
  cy.getByLabel("Name").type(newName);
  cy.getByLabel("Email address").clear();
  cy.getByLabel("Email address").type(newEmail);
  cy.getByLabel("Phone number").clear();
  cy.getByLabel("Phone number").type(newPhoneNumber);
  cy.getButtonByText("Save").click();
  cy.contains("Account settings updated");
  cy.getLinkByText(newName).click();
  cy.getLinkByText("Log out").click();
  cy.submitLoginForm(newEmail, password);
  cy.getLinkByText(newName).click();
  cy.getLinkByText("Settings").click();
  cy.getByLabel("Name").should("have.value", newName);
  cy.getByLabel("Email").should("have.value", newEmail);
  cy.getByLabel("Phone number").should("have.value", newPhoneNumber);
});
