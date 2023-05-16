import dockerCompose from "./dockerCompose";

export default {
  exec(args) {
    dockerCompose.run(["artisan", ...args]);
  },
  migrateFresh() {
    this.exec(["migrate:fresh"]);
  },
  seedDatabase(fixtures) {
    this.exec(["cypress:seed", `'${JSON.stringify(fixtures)}'`]);
  },
};
