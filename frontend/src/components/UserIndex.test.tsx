import React from "react";
import { render, screen } from "@testing-library/react";
import { random, range } from "lodash";
import { randomUser } from "../fixtures/random";
import UserIndex from "./UserIndex";
import { MemoryRouter } from "react-router";

const testUsers = range(random(10, 20)).map((index) => randomUser());

const Fixture: React.FC = ({ children }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

test("renders rows", () => {
  render(
    <Fixture>
      <UserIndex users={testUsers} />
    </Fixture>
  );

  screen.getByText(/name/i);
  screen.getByText(/email/i);
});

test("handles changes in sort order", () => {});
