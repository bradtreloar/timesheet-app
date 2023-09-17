import { faker } from "@faker-js/faker";

export const randomUserAttributes = () => ({
  name: faker.name.fullName(),
  email: faker.internet.email(),
  password: faker.random.alphaNumeric(12),
  phoneNumber: randomAustralianMobileNumber(),
});

export const randomAustralianMobileNumber = () => {
  const d = faker.random.numeric;
  const formats = [
    `04${d(8)}`,
    `04${d(2)} ${d(3)} ${d(3)}`,
    `04${d(2)}-${d(3)}-${d(3)}`,
  ];
  return formats[Math.floor(Math.random() * formats.length)];
};
