import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/client";

/**
 * Fetches current usage quotas for the authenticated user.
 */
export function useQuotas() {
  return useQuery({
    queryKey: ["user-quotas"],
    queryFn: async () => (await api.get("/api/users/me/quotas")).data,
    staleTime: 60_000,
  });
}
