import React from "react";
import { BrowserRouter } from "react-router-dom";
import { act, render, screen } from "@testing-library/react";
import Navbar from "./Navbar";
import { ProvidersFixture } from "fixtures/context";
import { client } from "services/datastore";
import MockAdapter from "axios-mock-adapter";

// Mock the HTTP client used by the datastore.
const mockClient = new MockAdapter(client);

test("renders navbar", async () => {
  mockClient.onGet("/user").reply(204);
  await act(async () => {
    render(
      <ProvidersFixture>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </ProvidersFixture>
    );
  });
  screen.getByText(/Log in/i);
});
