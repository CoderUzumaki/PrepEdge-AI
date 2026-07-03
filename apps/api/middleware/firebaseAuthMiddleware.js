import admin from "../config/firebase.js";
import { ERROR_CODES } from "@prepedge/shared";

const firebaseAuthMiddleware = async (req, res, next) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    return res.fail(ERROR_CODES.UNAUTHORIZED, "Unauthorized: Token missing");
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.firebaseUser = decodedToken;
    next();
  } catch {
    return res.fail(ERROR_CODES.UNAUTHORIZED, "Unauthorized: Invalid or expired token");
  }
};

export default firebaseAuthMiddleware;
