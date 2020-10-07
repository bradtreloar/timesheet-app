import React from "react";
import { render, act } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "./auth";
import { client } from "../services/datastore";
import { randomPassword, randomUser } from "../fixtures/random";
import IsAuthenticatedFixture from "../fixtures/IsAuthenticated";
import MockAdapter from "axios-mock-adapter";

// Mock the HTTP client used by the datastore.
const mockClient = new MockAdapter(client);

const PassiveFixture = () => {
  const { isAuthenticated, user } = useAuth();
  return <IsAuthenticatedFixture isAuthenticated={isAuthenticated} />;
};

const LoginFixture: React.FC<{ email: string; password: string }> = ({
  email,
  password,
}) => {
  const { isAuthenticated, login } = useAuth();

  return (
    <>
      <button
        onClick={async () => {
          // Wrap call to login in asynchronous act call because it updates
          // the AuthProvider's state.
          await act(async () => {
            login(email, password);
          });
        }}
      >
        Log in
      </button>
      <IsAuthenticatedFixture isAuthenticated={isAuthenticated} />
    </>
  );
};

const LogoutFixture = () => {
  const { isAuthenticated, logout } = useAuth();

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

beforeEach(() => {
  mockClient.onGet("/sanctum/csrf-cookie").reply(204);
});

afterEach(() => {
  mockClient.reset();

  // Clear the stored user object.
  (window as any).localStorage.removeItem("user");
});

test("initial state is unauthenticated", () => {
  render(
    <AuthProvider>
      <PassiveFixture />
    </AuthProvider>
  );

  screen.getByText(/User is not logged in/);
});

test("initial state is authenticated", () => {
  const mockUser = randomUser();
  (window as any).localStorage.setItem("user", JSON.stringify(mockUser));

  render(
    <AuthProvider>
      <PassiveFixture />
    </AuthProvider>
  );

  screen.getByText(/User is logged in/);
});

test("initial state is authenticated and user is admin", () => {
  const mockUser = randomUser(true);
  (window as any).localStorage.setItem("user", JSON.stringify(mockUser));

  const Fixture = () => {
    const { isAuthenticated, isAdmin } = useAuth();

    return (
      <IsAuthenticatedFixture
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
      />
    );
  };

  render(
    <AuthProvider>
      <Fixture />
    </AuthProvider>
  );

  screen.getByText(/User is admin/);
});

test("user logs in successfully", async () => {
  const mockUser = randomUser();
  const mockPassword = randomPassword();
  mockClient.onPost("/api/v1/login").reply(200, mockUser);

  render(
    <AuthProvider>
      <LoginFixture email={mockUser.email} password={mockPassword} />;
    </AuthProvider>
  );

  userEvent.click(screen.getByText(/Log in/));
  screen.findByText(/User is logged in/);
});

test("invalid login attempt fails", async () => {
  const mockUser = randomUser();
  const mockPassword = randomPassword();
  mockClient.onPost("/api/v1/login").reply(401);

  render(
    <AuthProvider>
      <LoginFixture email={mockUser.email} password={mockPassword} />;
    </AuthProvider>
  );

  userEvent.click(screen.getByText(/Log in/));
  screen.findByText(/User is not logged in/);
});

test("successful logout", async () => {
  const mockUser = randomUser();
  (window as any).localStorage.setItem("user", JSON.stringify(mockUser));
  mockClient.onGet("/api/v1/logout").reply(200);

  render(
    <AuthProvider>
      <LogoutFixture />
    </AuthProvider>
  );

  userEvent.click(screen.getByText(/Log out/));
  screen.findByText(/User is not logged in/);
});
