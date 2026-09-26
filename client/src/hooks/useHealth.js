import { useQuery } from "@tanstack/react-query";
import { getHealth } from "../api/healthApi";

export const useHealth = () => {
  return useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
  });
};