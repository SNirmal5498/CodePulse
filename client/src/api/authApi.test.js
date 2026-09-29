import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "./axios";

import {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
} from "./authApi";

vi.mock("./axios", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe("authApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registers a user", async () => {
    const userData = {
      name: "Nirmal",
      email: "nirmal@example.com",
      password: "password123",
    };

    api.post.mockResolvedValue({
      data: {
        message: "User registered successfully",
      },
    });

    const result = await registerUser(userData);

    expect(api.post).toHaveBeenCalledWith(
      "/auth/register",
      userData
    );

    expect(result).toEqual({
      message: "User registered successfully",
    });
  });

  it("logs in a user", async () => {
    const credentials = {
      email: "nirmal@example.com",
      password: "password123",
    };

    api.post.mockResolvedValue({
      data: {
        message: "Login successful",
      },
    });

    const result = await loginUser(credentials);

    expect(api.post).toHaveBeenCalledWith(
      "/auth/login",
      credentials
    );

    expect(result).toEqual({
      message: "Login successful",
    });
  });

  it("gets the user profile", async () => {
    api.get.mockResolvedValue({
      data: {
        name: "Nirmal",
        email: "nirmal@example.com",
      },
    });

    const result = await getProfile();

    expect(api.get).toHaveBeenCalledWith(
      "/user/profile"
    );

    expect(result).toEqual({
      name: "Nirmal",
      email: "nirmal@example.com",
    });
  });

  it("logs out the user", async () => {
    api.post.mockResolvedValue({
      data: {
        message: "Logout successful",
      },
    });

    const result = await logoutUser();

    expect(api.post).toHaveBeenCalledWith(
      "/auth/logout"
    );

    expect(result).toEqual({
      message: "Logout successful",
    });
  });
});