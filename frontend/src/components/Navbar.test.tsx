import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import Navbar from "./Navbar";
import { ProvidersFixture } from "fixtures/context";

test("renders navbar", () => {
  render(
    <ProvidersFixture>
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    </ProvidersFixture>
  );
  screen.getByText(/Log in/i);
});
