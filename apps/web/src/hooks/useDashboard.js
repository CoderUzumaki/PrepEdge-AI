import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/client";

export function useDashboardAnalytics() {
  return useQuery({
    queryKey: ["dashboard-analytics"],
    queryFn: async () => (await api.get("/api/interviews/analytics/dashboard")).data,
  });
}
