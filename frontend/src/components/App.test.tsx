import React from "react";
import { act, render, screen } from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "../context/auth";
import { MemoryRouter } from "react-router-dom";
import { randomPassword, randomUser } from "../fixtures/random";
import * as datastore from "../services/datastore";
import { Provider } from "react-redux";
import store from "../store";
jest.mock("services/datastore");

const mockUser = randomUser();
const mockPassword = randomPassword();

const AppFixture: React.FC<{
  routerEntries: string[];
}> = ({ routerEntries }) => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <MemoryRouter initialEntries={routerEntries}>
          <App />
        </MemoryRouter>
      </AuthProvider>
    </Provider>
  );
};

describe("unauthenticated user", () => {
  beforeEach(() => {
    jest.spyOn(datastore, "fetchCurrentUser").mockResolvedValue(null);
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
    screen.getByText(/forgot your password\? click here to reset it/i);
  });

  test("logs in", async () => {
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
    jest.spyOn(datastore, "login").mockRejectedValue(new Error("login failed"));

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
    localStorage.setItem("user", JSON.stringify(mockUser));
    jest.spyOn(datastore, "fetchCurrentUser").mockResolvedValue(mockUser);
  });

  test("views home page", async () => {
    await act(async () => {
      render(<AppFixture routerEntries={["/"]} />);
    });

    expect(screen.queryByText(/404/)).toBeNull();
    screen.getByText(/home page/i);
  });

  test("logs out", async () => {
    jest.spyOn(datastore, "logout").mockResolvedValue();
    jest.spyOn(window, "alert").mockImplementation(() => {});

    render(<AppFixture routerEntries={["/"]} />);

    expect(screen.getByRole("heading")).toHaveTextContent(/home page/i);
    userEvent.click(screen.getByText(mockUser.name));
    await act(async () => {
      userEvent.click(screen.getByTestId("logout-button"));
    });
    expect(screen.getByRole("heading")).toHaveTextContent(/log in/i);
  });
});
