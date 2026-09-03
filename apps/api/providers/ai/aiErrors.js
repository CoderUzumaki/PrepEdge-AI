import { AppError, ERROR_CODES } from "@prepedge/shared";

/**
 * Maps provider/parsing failures to stable AppError codes.
 * @param {unknown} err
 * @returns {AppError}
 */
export function toAiAppError(err) {
  if (err instanceof AppError) return err;

  const message = err instanceof Error ? err.message : String(err);
  if (
    message.includes("JSON") ||
    message.includes("Invalid score") ||
    message.includes("Invalid feedback") ||
    message.includes("Invalid AI") ||
    message.includes("Invalid resume summary") ||
    message.includes("Invalid interview summary") ||
    message.includes("No questions") ||
    message.includes("No valid questions")
  ) {
    return AppError.fromCode(
      ERROR_CODES.UPSTREAM_FAILURE,
      "AI returned an invalid response. Please try again."
    );
  }

  if (message.includes("All AI providers failed")) {
    return AppError.fromCode(ERROR_CODES.UPSTREAM_FAILURE, message);
  }

  return AppError.fromCode(ERROR_CODES.UPSTREAM_FAILURE, "AI service unavailable. Please try again.");
}
