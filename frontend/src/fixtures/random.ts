import { Store } from "redux";
import { User } from "../types";
import randomstring from "randomstring";

const formattedDate = (date: Date) =>
  `${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`;

const randomID = () => randomstring.generate();

const range = (length: number) => [...Array.from(new Array(length).keys())];

export const randomUser = (userIsAdmin?: boolean): User => {
  const isAdmin = userIsAdmin !== undefined && userIsAdmin;
  return {
    id: randomID(),
    name: randomstring.generate({
      length: 12,
      charset: "alphabetic",
    }),
    email: `${randomstring.generate({
      length: 12,
      charset: "alphabetic",
      capitalization: "lowercase",
    })}@example.com`,
    isAdmin: userIsAdmin,
  };
};

export const randomPassword = () => randomstring.generate();
