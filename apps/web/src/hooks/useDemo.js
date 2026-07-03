import { useMutation } from "@tanstack/react-query";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/lib/firebase";
import api from "@/lib/api/client";
import { trackEvent } from "@/lib/analytics";

export function useSampleQuestion() {
  return useMutation({
    mutationFn: async () => (await api.get("/api/demo/sample-question")).data,
  });
}

export function useSubmitSampleAnswer() {
  return useMutation({
    mutationFn: async (answer) =>
      (await api.post("/api/demo/sample-answer", { answer })).data,
  });
}

export function useEnterDemo() {
  return useMutation({
    mutationFn: async () => {
      trackEvent("demo_click");
      const { customToken } = (await api.post("/api/demo/session")).data;
      await signInWithCustomToken(auth, customToken);
    },
  });
}
