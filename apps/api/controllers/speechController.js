/**
 * @module controllers/speechController
 * @description HTTP handlers for speech-to-text transcription.
 */

import * as userService from "../services/userService.js";
import * as speechService from "../services/speechService.js";

/**
 * POST /api/speech/transcribe
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const transcribe = async (req, res, next) => {
  try {
    if (!req.file?.buffer) {
      return res.fail("validation_error", "Audio file is required.");
    }

    const user = await userService.getUserByFirebaseId(req.firebaseUser.uid);
    const result = await speechService.transcribe(
      user,
      req.file.buffer,
      req.file.mimetype || "audio/webm",
      req.requestId
    );

    res.success({
      text: result.text,
      durationMs: result.durationMs,
    });
  } catch (err) {
    next(err);
  }
};
