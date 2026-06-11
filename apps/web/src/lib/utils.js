import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function isValidObjectId(id) {
  return typeof id === "string" && id !== "undefined" && /^[a-f\d]{24}$/i.test(id);
}
