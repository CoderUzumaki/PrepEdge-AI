/**
 * @module controllers/demoController
 * @description Public demo endpoints for recruiters (sample question + magic-link session).
 */

import * as demoService from "../services/demoService.js";

/**
 * GET /api/demo/sample-question
 */
export const getSampleQuestion = async (req, res, next) => {
  try {
    res.success(demoService.getSampleQuestion());
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/demo/sample-answer
 */
export const submitSampleAnswer = async (req, res, next) => {
  try {
    const result = await demoService.scoreSampleAnswer(req.validatedBody.answer);
    res.success(result);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/demo/session — returns Firebase custom token for demo account.
 */
export const createSession = async (req, res, next) => {
  try {
    const session = await demoService.createDemoSession();
    res.success(session);
  } catch (err) {
    next(err);
  }
};
