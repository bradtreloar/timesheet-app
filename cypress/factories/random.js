import { faker } from "@faker-js/faker";

export const randomUserAttributes = () => ({
  name: faker.name.fullName(),
  email: faker.internet.email(),
  password: faker.random.alphaNumeric(12),
});
