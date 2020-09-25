import React from "react";
import { act, render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import LoginPage from "./LoginPage";
import { AuthProvider, useAuth } from "../context/auth";
import { client } from "../services/datastore";
import { mockPassword, mockUser } from "../fixtures/mocks";
import IsAuthenticatedFixture from "../fixtures/IsAuthenticated";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";

const mockClient = new MockAdapter(client);

beforeEach(() => {
  mockClient.onGet("/sanctum/csrf-cookie").reply(204);
});

afterEach(() => {
  mockClient.reset();
  
  // Clear the stored user object.
  (window as any).sessionStorage.removeItem("user");
});

test("renders login page", () => {
  render(
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  );
  screen.getByText(/You must sign in to continue/i);
});

test("login succeeds", async () => {
  mockClient.onPost("/api/v1/login").reply(200, mockUser);
  const mockEmail = mockUser.email;

  const Fixture: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return (
      <>
        <IsAuthenticatedFixture isAuthenticated={isAuthenticated} />
        {isAuthenticated || <LoginPage />}
      </>
    );
  };

  render(
    <AuthProvider>
      <Fixture />
    </AuthProvider>
  );

  screen.getByText(/User is not logged in/i);
  userEvent.type(screen.getByLabelText(/Email Address/), mockEmail);
  userEvent.type(screen.getByLabelText(/Password/), mockPassword);
  // Wrap login action in asynchronous act call because it updates
  // the AuthProvider's state.
  await act(async () => {
    userEvent.click(screen.getByText(/Log in/));
  });
  screen.getByText(/User is logged in/i);
});

test("invalid login attempt fails", async () => {
  mockClient.onPost("/api/v1/login").reply(401);
  const mockEmail = mockUser.email;

  const Fixture: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return (
      <>
        <IsAuthenticatedFixture isAuthenticated={isAuthenticated} />
        {isAuthenticated || <LoginPage />}
      </>
    );
  };

  render(
    <AuthProvider>
      <Fixture />
    </AuthProvider>
  );

  screen.getByText(/User is not logged in/i);
  userEvent.type(screen.getByLabelText(/Email Address/), mockEmail);
  userEvent.type(screen.getByLabelText(/Password/), mockPassword);
  // Wrap login action in asynchronous act call because it updates
  // the AuthProvider's state.
  await act(async () => {
    userEvent.click(screen.getByText(/Log in/));
  });
  screen.getByText(/User is not logged in/i);
});
