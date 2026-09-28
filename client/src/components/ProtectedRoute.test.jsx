import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeEach } from "vitest";

import ProtectedRoute from "./ProtectedRoute";

describe("ProtectedRoute", () => {

  beforeEach(() => {
    localStorage.clear();
  });

  it("redirects to login when token is missing", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <ProtectedRoute>
          <h1>Dashboard</h1>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  it("renders protected content when token exists", () => {
    localStorage.setItem("token", "test-jwt-token");

    render(
      <MemoryRouter initialEntries={["/"]}>
        <ProtectedRoute>
          <h1>Dashboard</h1>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

});