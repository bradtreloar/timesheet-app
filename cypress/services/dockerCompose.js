export default {
  exec(args) {
    cy.exec(`docker-compose ${args.join(" ")}`);
  },
  up(service, isDetached = true) {
    this.exec(["up", isDetached ? " --detach" : "", service]);
  },
  down() {
    this.exec(["down"]);
  },
  run(args) {
    this.exec(["run", "--rm", "php", ...args]);
  },
};
