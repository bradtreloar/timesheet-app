import React from "react";
import { act, render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import App from "./App";
import { AuthProvider } from "./context/auth";
import { client } from "./services/datastore";
import { mockPassword, mockUser } from "./fixtures/mocks";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";

// Mock the HTTP client used by the datastore.
const mockClient = new MockAdapter(client);
mockClient.onGet("/sanctum/csrf-cookie").reply(204);
mockClient.onPost("/api/v1/login").reply(200, mockUser);
mockClient.onGet("/api/v1/logout").reply(200);

test("renders unauthenticated app", () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  screen.getByText(/You must sign in to continue/i);
});

test("renders authenticated app", () => {
  (window as any).sessionStorage.setItem("user", JSON.stringify(mockUser));

  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  screen.findByText(/You are signed in/);

  (window as any).sessionStorage.removeItem("user");
});

test("successful login", async () => {
  const mockEmail = mockUser.email;

  await act(async () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
  });

  screen.getByText(/You must sign in to continue/i);
  userEvent.type(screen.getByLabelText(/Email Address/), mockEmail);
  userEvent.type(screen.getByLabelText(/Password/), mockPassword);
  // Wrap login action in asynchronous act call because it updates
  // the AuthProvider's state.
  await act(async () => {
    userEvent.click(screen.getByText(/Log in/));
  });
  screen.findByText(/You are signed in/);
});

test("successful logout", async () => {
  (window as any).sessionStorage.setItem("user", JSON.stringify(mockUser));

  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );

  screen.findByText(/You are signed in/);
  // Wrap logout action in asynchronous act call because it updates
  // the AuthProvider's state.
  await act(async () => {
    userEvent.click(screen.getByText(/Log out/));
  });
  screen.getByText(/You must sign in to continue/i);

  // Also make sure the user has been removed from SessionStorage.
  expect((window as any).sessionStorage.getItem("user")).toBe("null");
});
