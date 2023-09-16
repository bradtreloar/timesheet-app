import artisan from "../services/artisan";
import dockerCompose from "../services/dockerCompose";
import frontendYarn from "../services/frontendYarn";

export const commonHooks = () => {
  before(() => {
    frontendYarn.buildDev();
    dockerCompose.down();
    dockerCompose.up("httpd");
  });

  after(() => {
    dockerCompose.down();
  });

  beforeEach(() => {
    artisan.migrateFresh();
  });
};

export const getByLabel = (label) => {
  return cy
    .contains("label", label)
    .invoke("attr", "for")
    .then((id) => {
      cy.get("#" + id);
    });
};

export const getButtonByText = (text) => {
  return cy.contains("button", text);
};
