import { renderHook } from "@testing-library/react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { describe, it, expect, vi } from "vitest";

import { useProfile } from "./useProfile";
import { getProfile } from "../api/authApi";

vi.mock("../api/authApi");

describe("useProfile", () => {
  it("calls getProfile through React Query", async () => {
    getProfile.mockResolvedValue({
      name: "Nirmal",
      email: "nirmal@example.com",
    });

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    const { result } = renderHook(() => useProfile(), {
      wrapper,
    });

    expect(result.current).toBeDefined();

    await vi.waitFor(() => {
      expect(getProfile).toHaveBeenCalled();
    });
  });
});