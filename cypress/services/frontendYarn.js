export default {
  exec(args) {
    cy.exec(`cd frontend && yarn ${args.join(" ")}`);
  },
  buildDev() {
    this.exec(["build:dev"]);
  },
};
