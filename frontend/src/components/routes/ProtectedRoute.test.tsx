import React from "react";
import { MemoryRouter, Route } from "react-router-dom";
import { act, render, screen } from "@testing-library/react";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "context/auth";
import { randomUser } from "fixtures/random";
import { client } from "services/datastore";
import MockAdapter from "axios-mock-adapter";
import { makeUserData } from "services/adaptors";

// Mock the HTTP client used by the datastore.
const mockClient = new MockAdapter(client);

const Fixture = () => (
  <AuthProvider>
    <MemoryRouter initialEntries={["/"]}>
      <ProtectedRoute exact path="/">
        user is authenticated
      </ProtectedRoute>
      <Route exact path="/login">
        user is not authenticated
      </Route>
    </MemoryRouter>
  </AuthProvider>
);

beforeEach(() => {
  window.localStorage.clear();
  jest.clearAllMocks();
});

test("redirects to /login when not authenticated", async () => {
  mockClient.onGet("/api/user").reply(204);
  await act(async () => {
    render(<Fixture />);
  });
  screen.getByText(/user is not authenticated/i);
});

test("renders protected route when authenticated", async () => {
  const mockUser = randomUser();
  mockClient.onGet("/api/user").reply(200, makeUserData(mockUser));
  localStorage.setItem("user", JSON.stringify(mockUser));
  await act(async () => {
    render(<Fixture />);
  });
  screen.getByText(/user is authenticated/i);
});
