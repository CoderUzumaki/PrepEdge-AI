import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/client";

export function useTemplates() {
  return useQuery({
    queryKey: ["templates"],
    queryFn: async () => (await api.get("/api/templates")).data,
  });
}

export function useTemplate(id) {
  return useQuery({
    queryKey: ["template", id],
    queryFn: async () => (await api.get(`/api/templates/${id}`)).data,
    enabled: Boolean(id),
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => (await api.post("/api/templates", data)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["templates"] }),
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => (await api.delete(`/api/templates/${id}`)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["templates"] }),
  });
}

export function useStartFromTemplate(templateId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData) =>
      (await api.post(`/api/templates/${templateId}/start`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
      queryClient.invalidateQueries({ queryKey: ["user-quotas"] });
    },
  });
}
