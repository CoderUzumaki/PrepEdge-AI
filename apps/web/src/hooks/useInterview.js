import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/client";
import { isValidObjectId } from "@/lib/utils";

export function useInterviews() {
  return useQuery({
    queryKey: ["interviews"],
    queryFn: async () => (await api.get("/api/interviews")).data,
  });
}

export function useInterview(id) {
  return useQuery({
    queryKey: ["interview", id],
    queryFn: async () => (await api.get(`/api/interviews/${id}`)).data,
    enabled: isValidObjectId(id),
    refetchInterval: (query) =>
      query.state.data?.status === "generating" ? 3000 : false,
  });
}

export function useInterviewQuestions(id) {
  return useQuery({
    queryKey: ["interview-questions", id],
    queryFn: async () => (await api.get(`/api/interviews/${id}/questions`)).data,
    enabled: isValidObjectId(id),
    refetchInterval: (query) =>
      query.state.data?.status === "generating" ? 3000 : false,
  });
}

export function useScoringStatus(id, enabled = true) {
  return useQuery({
    queryKey: ["scoring-status", id],
    queryFn: async () => (await api.get(`/api/interviews/${id}/scoring-status`)).data,
    enabled: isValidObjectId(id) && enabled,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return 2000;
      const pending = data.answers?.some((a) => a.scoringStatus === "pending");
      const summaryPending = data.summaryStatus === "generating";
      return pending || summaryPending ? 2000 : false;
    },
  });
}

export function useSubmitAnswer(interviewId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ questionIndex, answer }) =>
      (await api.post(`/api/interviews/${interviewId}/answers`, { questionIndex, answer })).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scoring-status", interviewId] });
    },
  });
}

export function useUpdateProgress(interviewId) {
  return useMutation({
    mutationFn: async (data) =>
      (await api.patch(`/api/interviews/${interviewId}/progress`, data)).data,
  });
}

export function useSetupInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData) =>
      (await api.post("/api/interviews/setup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["interviews"] }),
  });
}

export function usePracticeQuestion() {
  return useMutation({
    mutationFn: async (data) =>
      (await api.post("/api/interviews/practice", data)).data,
  });
}
