import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Register from "./Register";
import { registerUser } from "../api/authApi";

vi.mock("../api/authApi", () => ({
  registerUser: vi.fn(),
}));

describe("Register", () => {
  it("renders the registration form", () => {
    render(<Register />);

    expect(
      screen.getByRole("heading", {
        name: "Create Account",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Name")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Email")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Password")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Create Account",
      })
    ).toBeInTheDocument();
  });

  it("updates form fields", async () => {
    const user = userEvent.setup();

    render(<Register />);

    await user.type(
      screen.getByLabelText("Name"),
      "Nirmal"
    );

    await user.type(
      screen.getByLabelText("Email"),
      "nirmal@example.com"
    );

    await user.type(
      screen.getByLabelText("Password"),
      "password123"
    );

    expect(
      screen.getByLabelText("Name")
    ).toHaveValue("Nirmal");

    expect(
      screen.getByLabelText("Email")
    ).toHaveValue("nirmal@example.com");

    expect(
      screen.getByLabelText("Password")
    ).toHaveValue("password123");
  });

  it("shows success message after registration", async () => {
    const user = userEvent.setup();

    registerUser.mockResolvedValue({
      name: "Nirmal",
    });

    render(<Register />);

    await user.type(
      screen.getByLabelText("Name"),
      "Nirmal"
    );

    await user.type(
      screen.getByLabelText("Email"),
      "nirmal@example.com"
    );

    await user.type(
      screen.getByLabelText("Password"),
      "password123"
    );

    await user.click(
      screen.getByRole("button", {
        name: "Create Account",
      })
    );

    expect(
      await screen.findByText(
        "Account created for Nirmal"
      )
    ).toBeInTheDocument();

    expect(registerUser).toHaveBeenCalledWith({
      name: "Nirmal",
      email: "nirmal@example.com",
      password: "password123",
    });
  });

  it("shows API error message after registration fails", async () => {
    const user = userEvent.setup();

    registerUser.mockRejectedValue({
      response: {
        data: {
          message: "Email already exists",
        },
      },
    });

    render(<Register />);

    await user.type(
      screen.getByLabelText("Name"),
      "Nirmal"
    );

    await user.type(
      screen.getByLabelText("Email"),
      "nirmal@example.com"
    );

    await user.type(
      screen.getByLabelText("Password"),
      "password123"
    );

    await user.click(
      screen.getByRole("button", {
        name: "Create Account",
      })
    );

    expect(
      await screen.findByText(
        "Email already exists"
      )
    ).toBeInTheDocument();
  });

  it("shows default error message when API error has no message", async () => {
    const user = userEvent.setup();

    registerUser.mockRejectedValue({});

    render(<Register />);

    await user.type(
      screen.getByLabelText("Name"),
      "Nirmal"
    );

    await user.type(
      screen.getByLabelText("Email"),
      "nirmal@example.com"
    );

    await user.type(
      screen.getByLabelText("Password"),
      "password123"
    );

    await user.click(
      screen.getByRole("button", {
        name: "Create Account",
      })
    );

    expect(
      await screen.findByText(
        "Registration failed"
      )
    ).toBeInTheDocument();
  });
});