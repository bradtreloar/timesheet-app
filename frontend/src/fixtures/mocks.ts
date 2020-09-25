import randomstring from "randomstring";
import { User } from "../types";

const getMockUser = (userIsAdmin?: boolean): User => {
  const isAdmin = userIsAdmin !== undefined && userIsAdmin;
  return {
    isAdmin: isAdmin,
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
};

const getMockPassword = () => randomstring.generate();

export { getMockUser, getMockPassword };
