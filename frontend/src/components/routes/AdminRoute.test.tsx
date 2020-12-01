import React from "react";
import { MemoryRouter, Route } from "react-router-dom";
import { act, render, screen } from "@testing-library/react";
import { AuthProvider } from "context/auth";
import { randomUser } from "fixtures/random";
import { client } from "services/datastore";
import MockAdapter from "axios-mock-adapter";
import { makeUserData } from "services/adaptors";
import AdminRoute from "./AdminRoute";

// Mock the HTTP client used by the datastore.
const mockClient = new MockAdapter(client);

const Fixture = () => (
  <AuthProvider>
    <MemoryRouter initialEntries={["/"]}>
      <AdminRoute exact path="/">
        user is admin
      </AdminRoute>
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

test("renders admin route when authenticated as admin", async () => {
  const testUser = randomUser(true);
  mockClient.onGet("/api/user").reply(200, makeUserData(testUser));
  localStorage.setItem("user", JSON.stringify(testUser));
  await act(async () => {
    render(<Fixture />);
  });
  screen.getByText(/user is admin/i);
});

test("renders access denied route when authenticated but not admin", async () => {
  const testUser = randomUser();
  mockClient.onGet("/api/user").reply(200, makeUserData(testUser));
  localStorage.setItem("user", JSON.stringify(testUser));
  await act(async () => {
    render(<Fixture />);
  });
  screen.getByText(/403/i);
});
