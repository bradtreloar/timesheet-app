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
