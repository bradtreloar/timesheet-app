import randomstring from "randomstring";
import { User } from "../types";

const mockUser: User = {
  id: randomstring.generate({
    length: 1,
    charset: "numeric",
  }),
  name: randomstring.generate({
    length: 12,
    charset: "alphabetic",
  }),
  email: `${randomstring.generate({
    length: 12,
    charset: "alphabetic",
    capitalization: "lowercase",
  })}@example.com`,
};

const mockPassword = randomstring.generate();

export { mockUser, mockPassword };
