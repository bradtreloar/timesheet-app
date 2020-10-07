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

  // Clear the stored user object.
  (window as any).localStorage.removeItem("user");
});

afterEach(() => {
  mockClient.reset();
});

test("user is unauthenticated", async () => {
  await act(async () => {
    render(
      <AuthProvider>
        <PassiveFixture />
      </AuthProvider>
    );
  });

  screen.getByText(/User is not logged in/);
});

test("user is authenticated", async () => {
  const mockUser = randomUser();
  mockClient.onGet("/api/v1/user").reply(200, mockUser);
  (window as any).localStorage.setItem("user", JSON.stringify(mockUser));

  await act(async () => {
    render(
      <AuthProvider>
        <PassiveFixture />
      </AuthProvider>
    );
  });

  screen.getByText(/User is logged in/);
});

test("admin user is authenticated", async () => {
  const mockUser = randomUser(true);
  mockClient.onGet("/api/v1/user").reply(200, mockUser);
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

  await act(async () => {
    render(
      <AuthProvider>
        <Fixture />
      </AuthProvider>
    );
  });

  screen.getByText(/User is admin/);
});

test("user logs in successfully", async () => {
  const mockUser = randomUser();
  const mockPassword = randomPassword();
  mockClient.onPost("/api/v1/login").reply(200, mockUser);

  await act(async () => {
    render(
      <AuthProvider>
        <LoginFixture email={mockUser.email} password={mockPassword} />;
      </AuthProvider>
    );
  });

  userEvent.click(screen.getByText(/Log in/));
  screen.findByText(/User is logged in/);
});

test("invalid user fails to log in", async () => {
  const mockUser = randomUser();
  const mockPassword = randomPassword();
  mockClient.onPost("/api/v1/login").reply(401);

  await act(async () => {
    render(
      <AuthProvider>
        <LoginFixture email={mockUser.email} password={mockPassword} />;
      </AuthProvider>
    );
  });

  userEvent.click(screen.getByText(/Log in/));
  screen.findByText(/User is not logged in/);
});

test("user logs out successfully", async () => {
  const mockUser = randomUser();
  (window as any).localStorage.setItem("user", JSON.stringify(mockUser));
  mockClient.onGet("/api/v1/user").reply(200, mockUser);
  mockClient.onGet("/api/v1/logout").reply(200);

  await act(async () => {
    render(
      <AuthProvider>
        <LogoutFixture />
      </AuthProvider>
    );
  });

  userEvent.click(screen.getByText(/Log out/));
  screen.findByText(/User is not logged in/);
});
