import React from "react";
import { act, render, screen } from "@testing-library/react";
import App from "./App";
import randomstring from "randomstring";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "./context/auth";
import { MemoryRouter } from "react-router-dom";
import { randomPassword, randomUser } from "./fixtures/random";
import * as datastore from "./services/datastore";
jest.mock("./services/datastore");

const AppFixture: React.FC<{
  routerEntries: string[];
}> = ({ routerEntries }) => {
  return (
    <AuthProvider>
      <MemoryRouter initialEntries={routerEntries}>
        <App />
      </MemoryRouter>
    </AuthProvider>
  );
};

describe("unauthenticated user", () => {
  beforeEach(() => {
    jest
      .spyOn(datastore, "fetchCurrentUser")
      .mockRejectedValue(new datastore.NoCurrentUserException());
  });

  test("triggers 404 page", async () => {
    await act(async () => {
      render(<AppFixture routerEntries={["/nonexistent-page"]} />);
    });

    expect(screen.getByRole("heading")).toHaveTextContent(
      /404: Page not found/i
    );
  });

  test("redirected to login page", async () => {
    await act(async () => {
      render(<AppFixture routerEntries={["/"]} />);
    });

    expect(screen.getByRole("heading")).toHaveTextContent(/Log in/i);
  });

  test("logs in", async () => {
    const mockUser = randomUser();
    const mockPassword = randomPassword();
    jest.spyOn(datastore, "login").mockResolvedValue(mockUser);

    await act(async () => {
      render(<AppFixture routerEntries={["/login"]} />);
    });

    expect(screen.getByRole("heading")).toHaveTextContent(/Log in/i);
    userEvent.type(screen.getByLabelText(/Email Address/), mockUser.email);
    userEvent.type(screen.getByLabelText(/Password/), mockPassword);
    await act(async () => {
      userEvent.click(screen.getByTestId("login-form-submit"));
    });
    expect(screen.getByRole("heading")).toHaveTextContent(/home page/i);
  });

  test("receives error when login fails", async () => {
    const mockUser = randomUser();
    const mockPassword = randomPassword();
    jest.spyOn(datastore, "login").mockRejectedValue("login failed");

    await act(async () => {
      render(<AppFixture routerEntries={["/login"]} />);
    });

    expect(screen.getByRole("heading")).toHaveTextContent(/Log in/i);
    userEvent.type(screen.getByLabelText(/Email Address/), mockUser.email);
    userEvent.type(screen.getByLabelText(/Password/), mockPassword);
    await act(async () => {
      userEvent.click(screen.getByTestId("login-form-submit"));
    });
    expect(screen.getByRole("heading")).toHaveTextContent(/Log in/i);
    screen.getByText("login failed");
  });
});

describe("authenticated user", () => {
  beforeEach(() => {
    // Store a current user in state.
    const mockUser = randomUser();
    const mockLogoutToken = randomstring.generate();
    (window as any).localStorage.setItem("user", JSON.stringify(mockUser));
    jest.spyOn(datastore, "fetchCurrentUser").mockResolvedValue(mockUser);
  });

  test("views home page", async () => {
    await act(async () => {
      render(<AppFixture routerEntries={["/"]} />);
    });

    expect(screen.queryByText(/404/)).toBeNull();
    screen.getByText(/Home page/i);
  });

  test("logs out", async () => {
    const user = JSON.parse((window as any).localStorage.getItem("user"));
    jest.spyOn(datastore, "logout").mockResolvedValue();
    jest.spyOn(window, "alert").mockImplementation(() => {});

    render(<AppFixture routerEntries={["/"]} />);

    expect(screen.getByRole("heading")).toHaveTextContent(/home page/i);
    userEvent.click(screen.getByText(user.name));
    await act(async () => {
      userEvent.click(screen.getByTestId("logout-button"));
    });
    expect(screen.getByRole("heading")).toHaveTextContent(/log in/i);
  });
});
