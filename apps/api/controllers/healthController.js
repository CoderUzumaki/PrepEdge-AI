const startTime = Date.now();

export const healthCheck = (_req, res) => {
  res.json({
    status: "ok",
    uptime: Math.floor((Date.now() - startTime) / 1000),
    timestamp: new Date().toISOString(),
    version: "2.0.0",
  });
};
