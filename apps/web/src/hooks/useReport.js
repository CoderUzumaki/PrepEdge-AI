import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/client";
import { isValidObjectId } from "@/lib/utils";

export function useReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: async () => (await api.get("/api/reports")).data,
  });
}

export function useReport(interviewId) {
  return useQuery({
    queryKey: ["report", interviewId],
    queryFn: async () => (await api.get(`/api/reports/${interviewId}`)).data,
    enabled: isValidObjectId(interviewId),
    retry: 1,
  });
}
