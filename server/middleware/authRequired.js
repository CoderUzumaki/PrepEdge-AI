import admin from "firebase-admin";

export default async function authRequired(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = { id: decoded.uid };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
