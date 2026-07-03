import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/client";

/**
 * POST /api/speech/transcribe — sends audio blob for Groq Whisper transcription.
 */
export function useTranscribe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (audioBlob) => {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      return (await api.post("/api/speech/transcribe", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-quotas"] });
    },
  });
}
