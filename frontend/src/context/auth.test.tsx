import React from "react";
import { render, act } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "./auth";
import { client } from "../services/datastore";
import { getMockPassword, getMockUser } from "../fixtures/mocks";
import IsAuthenticatedFixture from "../fixtures/IsAuthenticated";
import MockAdapter from "axios-mock-adapter";

// Mock the HTTP client used by the datastore.
const mockClient = new MockAdapter(client);

beforeEach(() => {
  mockClient.onGet("/sanctum/csrf-cookie").reply(204);
});

afterEach(() => {
  mockClient.reset();

  // Clear the stored user object.
  (window as any).sessionStorage.removeItem("user");
});

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
  const mockUser = getMockUser();
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
});

test("initial state is authenticated and user is admin", () => {
  const mockUser = getMockUser(true);
  (window as any).sessionStorage.setItem("user", JSON.stringify(mockUser));

  const Fixture = () => {
    const { isAuthenticated, isAdmin } = useAuth();

    return <IsAuthenticatedFixture isAuthenticated={isAuthenticated} isAdmin={isAdmin} />;
  };

  render(
    <AuthProvider>
      <Fixture />
    </AuthProvider>
  );

  screen.getByText(/User is admin/);
});

test("successful login", async () => {
  const mockUser = getMockUser();
  const mockPassword = getMockPassword();
  mockClient.onPost("/api/v1/login").reply(200, mockUser);

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

test("invalid login attempt fails", async () => {
  const mockUser = getMockUser();
  const mockPassword = getMockPassword();
  mockClient.onPost("/api/v1/login").reply(401);
  
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
  screen.findByText(/User is not logged in/);
});

test("successful logout", async () => {
  const mockUser = getMockUser();
  (window as any).sessionStorage.setItem("user", JSON.stringify(mockUser));
  mockClient.onGet("/api/v1/logout").reply(200);

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
