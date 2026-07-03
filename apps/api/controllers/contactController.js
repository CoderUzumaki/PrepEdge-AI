/**
 * @module controllers/contactController
 * @description Public contact form handler.
 */

import * as contactService from "../services/contactService.js";

/**
 * POST /api/contact
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const sendContact = async (req, res, next) => {
  try {
    await contactService.sendContactEmail(req.validatedBody);
    res.success({ message: "Message sent successfully" });
  } catch (err) {
    next(err);
  }
};
