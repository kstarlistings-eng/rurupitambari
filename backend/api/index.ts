// Vercel serverless function entry point for the Express backend.
// This file re-exports the configured Express app so Vercel can serve it
// without starting a standalone HTTP server.
import app from "../src/index.js";

export default app;
