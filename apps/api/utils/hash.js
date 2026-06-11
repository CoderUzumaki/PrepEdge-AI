import crypto from "crypto";

export const hashBuffer = (buffer) =>
  crypto.createHash("sha256").update(buffer).digest("hex");
