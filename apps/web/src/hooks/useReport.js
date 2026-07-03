import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

export function usePublicReport(token) {
  return useQuery({
    queryKey: ["public-report", token],
    queryFn: async () => (await api.get(`/api/reports/public/${token}`)).data,
    enabled: Boolean(token),
    retry: 1,
  });
}

export function useEnableReportShare(interviewId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () =>
      (await api.post(`/api/reports/${interviewId}/share`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report", interviewId] });
    },
  });
}

export function useDisableReportShare(interviewId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () =>
      (await api.delete(`/api/reports/${interviewId}/share`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report", interviewId] });
    },
  });
}
