import express from "express";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Middleware for parsing JSON payloads
  app.use(express.json({ limit: '20mb' }));

  // Debug request logger
  app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production' && req.path.includes('.')) {
      console.log(`[Prod] Request for asset: ${req.path}`);
    }
    next();
  });

  // --- Vite / Static Assets Handling ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve the dist folder
    const distPath = path.resolve(process.cwd(), "dist");
    console.log(`[Prod] Serving static files from: ${distPath}`);
    console.log(`[Prod] Current working directory: ${process.cwd()}`);
    
    // Serve static files first
    app.use(express.static(distPath));

    // Handle SPA routing
    app.get("*", (req, res) => {
      // API routes should have been handled above
      // If it's a file request that wasn't found by express.static, don't serve index.html
      if (req.path.includes(".") && !req.path.endsWith(".html")) {
        console.warn(`[Prod] Asset not found: ${req.path}`);
        res.status(404).end();
        return;
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
