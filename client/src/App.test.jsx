import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";

import App from "./App";
import { useProfile } from "./hooks/useProfile";
import { logoutUser } from "./api/authApi";

vi.mock("./hooks/useProfile", () => ({
  useProfile: vi.fn(),
}));

vi.mock("./api/authApi", () => ({
  logoutUser: vi.fn(),
}));

vi.mock("./components/ProtectedRoute", () => ({
  default: ({ children }) => children,
}));

const renderApp = (initialEntries = ["/"]) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state while profile is loading", () => {
    useProfile.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    renderApp();

    expect(
      screen.getByText("Loading your profile...")
    ).toBeInTheDocument();
  });

  it("shows error state when profile loading fails", () => {
    useProfile.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    renderApp();

    expect(
      screen.getByText("Unable to load profile")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Please login again.")
    ).toBeInTheDocument();
  });

  it("displays profile information when profile loads successfully", () => {
    useProfile.mockReturnValue({
      data: {
        name: "Nirmal",
        email: "nirmal@example.com",
        role: "USER",
      },
      isLoading: false,
      isError: false,
    });

    renderApp();

    expect(
      screen.getByText((content) => content.includes("Welcome, Nirmal"))
    ).toBeInTheDocument();

    expect(
      screen.getByText("nirmal@example.com")
    ).toBeInTheDocument();

    expect(
      screen.getByText("USER")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Developer Productivity & Career Intelligence Platform"
      )
    ).toBeInTheDocument();
  });

  it("logs out successfully", async () => {
    useProfile.mockReturnValue({
      data: {
        name: "Nirmal",
        email: "nirmal@example.com",
        role: "USER",
      },
      isLoading: false,
      isError: false,
    });

    logoutUser.mockResolvedValue({});

    renderApp();

    fireEvent.click(
      screen.getByRole("button", { name: "Logout" })
    );

    await waitFor(() => {
      expect(logoutUser).toHaveBeenCalledTimes(1);
    });
  });

  it("handles logout failure", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    useProfile.mockReturnValue({
      data: {
        name: "Nirmal",
        email: "nirmal@example.com",
        role: "USER",
      },
      isLoading: false,
      isError: false,
    });

    logoutUser.mockRejectedValue(
      new Error("Logout failed")
    );

    renderApp();

    fireEvent.click(
      screen.getByRole("button", { name: "Logout" })
    );

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        "Logout failed",
        expect.any(Error)
      );
    });

    consoleError.mockRestore();
  });
});