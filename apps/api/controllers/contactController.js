import * as contactService from "../services/contactService.js";

export const sendContact = async (req, res, next) => {
  try {
    await contactService.sendContactEmail(req.validatedBody);
    res.status(200).json({ message: "Message sent successfully" });
  } catch (err) {
    next(err);
  }
};
