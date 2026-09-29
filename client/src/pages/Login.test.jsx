import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import Login from "./Login";
import { loginUser } from "../api/authApi";

vi.mock("../api/authApi", () => ({
  loginUser: vi.fn(),
}));

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the login form", () => {
    render(<Login />);

    expect(
      screen.getByRole("heading", { name: "Welcome Back" })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Email")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Password")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Login" })
    ).toBeInTheDocument();
  });

  it("updates email and password fields", () => {
    render(<Login />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    fireEvent.change(emailInput, {
      target: {
        name: "email",
        value: "nirmal@example.com",
      },
    });

    fireEvent.change(passwordInput, {
      target: {
        name: "password",
        value: "password123",
      },
    });

    expect(emailInput).toHaveValue("nirmal@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("logs in successfully", async () => {
    loginUser.mockResolvedValue({});

    render(<Login />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: {
        name: "email",
        value: "nirmal@example.com",
      },
    });

    fireEvent.change(screen.getByLabelText("Password"), {
      target: {
        name: "password",
        value: "password123",
      },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Login" })
    );

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        email: "nirmal@example.com",
        password: "password123",
      });
    });
  });

  it("shows API error message when login fails", async () => {
    loginUser.mockRejectedValue({
      response: {
        data: {
          message: "Invalid credentials",
        },
      },
    });

    render(<Login />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: {
        name: "email",
        value: "nirmal@example.com",
      },
    });

    fireEvent.change(screen.getByLabelText("Password"), {
      target: {
        name: "password",
        value: "wrongpassword",
      },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Login" })
    );

    expect(
      await screen.findByText("Invalid credentials")
    ).toBeInTheDocument();
  });

  it("shows default error when login fails without an API message", async () => {
    loginUser.mockRejectedValue(new Error("Network error"));

    render(<Login />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: {
        name: "email",
        value: "nirmal@example.com",
      },
    });

    fireEvent.change(screen.getByLabelText("Password"), {
      target: {
        name: "password",
        value: "wrongpassword",
      },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Login" })
    );

    expect(
      await screen.findByText("Login failed")
    ).toBeInTheDocument();
  });
});