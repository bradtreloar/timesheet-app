import React from "react";
import { render, act } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "./auth";
import { client } from "../services/datastore";
import { randomPassword, randomUser } from "../fixtures/random";
import IsAuthenticatedFixture from "../fixtures/IsAuthenticated";
import MockAdapter from "axios-mock-adapter";
import { makeUserData } from "../helpers/jsonAPI";

// Mock the HTTP client used by the datastore.
const mockClient = new MockAdapter(client);

const mockUser = randomUser();
const mockAdminUser = randomUser(true);
const mockPassword = randomPassword();

const PassiveFixture = () => {
  const { isAuthenticated } = useAuth();
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
  mockClient.onGet("/api/csrf-cookie").reply(204);
  localStorage.clear();
});

afterEach(() => {
  mockClient.reset();
});

describe("unauthenticated user", () => {
  beforeEach(() => {
    mockClient.onGet("/api/user").reply(204);
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

  test("user logs in successfully", async () => {
    mockClient.onPost("/api/login").reply(200, makeUserData(mockUser));

    await act(async () => {
      render(
        <AuthProvider>
          <LoginFixture email={mockUser.email} password={mockPassword} />;
        </AuthProvider>
      );
    });

    await act(async () => {
      userEvent.click(screen.getByText(/Log in/));
    });
    screen.getByText(/User is logged in/);
  });

  test("invalid user fails to log in", async () => {
    mockClient.onPost("/api/login").reply(422);

    await act(async () => {
      render(
        <AuthProvider>
          <LoginFixture email={mockUser.email} password={mockPassword} />;
        </AuthProvider>
      );
    });

    await act(async () => {
      userEvent.click(screen.getByText(/Log in/));
    });
    screen.getByText(/User is not logged in/);
  });

  test("has pre-existing session", async () => {
    mockClient.onGet("/api/user").reply(200, makeUserData(mockUser));

    await act(async () => {
      render(
        <AuthProvider>
          <LogoutFixture />
        </AuthProvider>
      );
    });

    screen.getByText(/User is logged in/);
  });
});

describe("authenticated user", () => {
  beforeEach(() => {
    localStorage.setItem("user", JSON.stringify(mockUser));
    mockClient.onGet("/api/user").reply(200, makeUserData(mockUser));
  });

  test("user is authenticated", async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <PassiveFixture />
        </AuthProvider>
      );
    });

    screen.getByText(/User is logged in/);
  });

  test("user logs out successfully", async () => {
    mockClient.onPost("/api/logout").reply(200);

    await act(async () => {
      render(
        <AuthProvider>
          <LogoutFixture />
        </AuthProvider>
      );
    });

    await act(async () => {
      userEvent.click(screen.getByText(/Log out/));
    });
    screen.getByText(/User is not logged in/);
  });

  test("session has expired", async () => {
    mockClient.onGet("/api/user").reply(204, makeUserData(mockUser));

    await act(async () => {
      render(
        <AuthProvider>
          <LogoutFixture />
        </AuthProvider>
      );
    });

    screen.getByText(/User is not logged in/);
  });
});

describe("admin user", () => {
  beforeEach(() => {
    localStorage.setItem("user", JSON.stringify(mockAdminUser));
    mockClient.onGet("/api/user").reply(200, makeUserData(mockAdminUser));
  });

  test("admin user is authenticated", async () => {
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
});
