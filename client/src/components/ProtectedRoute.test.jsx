import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

import ProtectedRoute from "./ProtectedRoute";
import { useProfile } from "../hooks/useProfile";

vi.mock("../hooks/useProfile");

describe("ProtectedRoute", () => {

  it("shows loading state while checking authentication", () => {
    useProfile.mockReturnValue({
      isLoading: true,
      isError: false,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <h1>Dashboard</h1>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(
      screen.getByText("Checking authentication...")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Dashboard")
    ).not.toBeInTheDocument();
  });

  it("redirects to login when authentication fails", () => {
    useProfile.mockReturnValue({
      isLoading: false,
      isError: true,
    });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <ProtectedRoute>
          <h1>Dashboard</h1>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(
      screen.queryByText("Dashboard")
    ).not.toBeInTheDocument();
  });

  it("renders protected content when authentication succeeds", () => {
    useProfile.mockReturnValue({
      isLoading: false,
      isError: false,
    });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <ProtectedRoute>
          <h1>Dashboard</h1>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(
      screen.getByText("Dashboard")
    ).toBeInTheDocument();
  });
});