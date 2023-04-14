import React from "react";
import { render, screen } from "@testing-library/react";
import { orderBy, random, range } from "lodash";
import { randomUser } from "fixtures/random";
import UserTable from "./UserTable";
import { MemoryRouter } from "react-router";
import userEvent from "@testing-library/user-event";

const testUsers = range(random(8, 10)).map((index) => randomUser());
const sortedTestUsers = orderBy(testUsers, ["name"], ["asc"]);

const Fixture: React.FC = ({ children }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

test("renders rows", () => {
  render(
    <Fixture>
      <UserTable users={testUsers} />
    </Fixture>
  );

  screen.getByText(/^name/i);
  screen.getByText(/email/i);

  // Check that the users are sorted in the right order
  const emailLinks = screen.getAllByText(/@/);

  sortedTestUsers.forEach((user, index) => {
    expect(emailLinks[index]).toHaveTextContent(user.email);
  });
});

test("handles changes in sort order", () => {
  render(
    <Fixture>
      <UserTable users={testUsers} />
    </Fixture>
  );

  let emailLinks = screen.getAllByText(/@/);
  sortedTestUsers.forEach((user, index) => {
    expect(emailLinks[index]).toHaveTextContent(user.email);
  });

  // Sort by name, descending
  userEvent.click(screen.getByText(/^name/i));
  emailLinks = screen.getAllByText(/@/);
  sortedTestUsers.reverse().forEach((user, index) => {
    expect(emailLinks[index]).toHaveTextContent(user.email);
  });

  // Sort by email, ascending
  const resortedTestUsers = orderBy(testUsers, ["email"], ["asc"]);
  userEvent.click(screen.getByText(/^email/i));
  emailLinks = screen.getAllByText(/@/);
  resortedTestUsers.forEach((user, index) => {
    expect(emailLinks[index]).toHaveTextContent(user.email);
  });

  // Sort by email, descending
  userEvent.click(screen.getByText(/^email/i));
  emailLinks = screen.getAllByText(/@/);
  resortedTestUsers.reverse().forEach((user, index) => {
    expect(emailLinks[index]).toHaveTextContent(user.email);
  });
});
