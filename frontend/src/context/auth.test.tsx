import React from "react";
import { render, act } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "./auth";
import { User } from "../types";
import { client } from "../services/datastore";
import { mockPassword, mockUser } from "../fixtures/mocks";
import IsAuthenticatedFixture from "../fixtures/IsAuthenticated";

// Mock the HTTP client used by the datastore.
var MockAdapter = require("axios-mock-adapter");
var mockClient = new MockAdapter(client);
mockClient.onGet("/sanctum/csrf-cookie").reply(204);
mockClient.onPost("/api/v1/login").reply(200, mockUser);
mockClient.onGet("/api/v1/logout").reply(200);

test("initial state is unauthenticated", () => {
  const Fixture = () => {
    const { isAuthenticated } = useAuth();

    return <IsAuthenticatedFixture isAuthenticated={isAuthenticated} />;
  };

  render(
    <AuthProvider>
      <Fixture />
    </AuthProvider>
  );

  screen.getByText(/User is not logged in/);
});

test("initial state is authenticated", () => {
  (window as any).sessionStorage.setItem("user", JSON.stringify(mockUser));

  const Fixture = () => {
    const { isAuthenticated } = useAuth();

    return <IsAuthenticatedFixture isAuthenticated={isAuthenticated} />;
  };

  render(
    <AuthProvider>
      <Fixture />
    </AuthProvider>
  );

  screen.getByText(/User is logged in/);

  (window as any).sessionStorage.removeItem("user");
});

test("successful login", async () => {
  const Fixture = () => {
    const { isAuthenticated, login } = useAuth();
    const { email } = mockUser;

    return (
      <>
        <button
          onClick={async () => {
            // Wrap call to login in asynchronous act call because it updates
            // the AuthProvider's state.
            await act(async () => {
              login(email, mockPassword);
            });
          }}
        >
          Log in
        </button>
        <IsAuthenticatedFixture isAuthenticated={isAuthenticated} />
      </>
    );
  };

  render(
    <AuthProvider>
      <Fixture />
    </AuthProvider>
  );

  userEvent.click(screen.getByText(/Log in/));
  screen.findByText(/User is logged in/);
});

test("successful logout", async () => {
  (window as any).sessionStorage.setItem("user", JSON.stringify(mockUser));

  const Fixture = () => {
    const { isAuthenticated, logout } = useAuth();
    const { email } = mockUser;

    return (
      <>
        <button
          onClick={async () => {
            // Wrap call to login in act because it updates the
            // AuthProvider's state.
            await act(async () => {
              logout();
            });
          }}
        >
          Log out
        </button>
        <IsAuthenticatedFixture isAuthenticated={isAuthenticated} />
      </>
    );
  };

  render(
    <AuthProvider>
      <Fixture />
    </AuthProvider>
  );

  userEvent.click(screen.getByText(/Log out/));
  screen.findByText(/User is not logged in/);
});
