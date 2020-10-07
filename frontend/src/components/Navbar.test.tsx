import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import Navbar from "./Navbar";
import { AuthProvider } from "../context/auth";

test("renders navbar", () => {
  render(
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    </AuthProvider>
  );
  screen.getByText(/Log in/i);
});
