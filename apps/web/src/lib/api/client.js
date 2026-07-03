import axios from "axios";
import { auth } from "@/lib/firebase";
import { ApiError, normalizeApiError } from "@/lib/api/errors";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const { data: body } = response;

    if (body?.error != null) {
      return Promise.reject(
        new ApiError(normalizeApiError(body, response.status), response.status)
      );
    }

    if (!body || !("data" in body)) {
      return Promise.reject(
        new ApiError(
          { code: "internal_error", message: "Invalid API response format" },
          response.status
        )
      );
    }

    response.data = body.data;
    return response;
  },
  (error) => Promise.reject(ApiError.fromAxios(error))
);

export default api;
