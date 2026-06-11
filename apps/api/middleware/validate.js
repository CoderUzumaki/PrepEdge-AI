export const validate = (schema, source = "body") => (req, res, next) => {
  const data = source === "query" ? req.query : req.body;
  const result = schema.safeParse(data);

  if (!result.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: result.error.flatten().fieldErrors,
    });
  }

  if (source === "query") {
    req.validatedQuery = result.data;
  } else {
    req.validatedBody = result.data;
  }
  next();
};
