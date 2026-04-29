import express from "express";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

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

  // --- Server-side Gemini API route ---
  app.post("/api/analyze", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        res.status(500).json({ error: "Gemini API key is not configured." });
        return;
      }
      const { base64Image } = req.body;
      if (!base64Image) {
        res.status(400).json({ error: "base64Image is required." });
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const base64Data = base64Image.split(",")[1] || base64Image;

      const ANALYSIS_SCHEMA = {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          urduTitle: { type: Type.STRING },
          embroideryStyles: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                style: { type: Type.STRING },
                urduStyle: { type: Type.STRING },
                description: { type: Type.STRING },
                urduDescription: { type: Type.STRING },
              },
              required: ["style", "urduStyle", "description", "urduDescription"],
            },
          },
          craftPlacement: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                location: { type: Type.STRING },
                urduLocation: { type: Type.STRING },
                detail: { type: Type.STRING },
                urduDetail: { type: Type.STRING },
              },
              required: ["location", "urduLocation", "detail", "urduDetail"],
            },
          },
          costEstimate: {
            type: Type.OBJECT,
            properties: {
              min: { type: Type.NUMBER },
              max: { type: Type.NUMBER },
              currency: { type: Type.STRING },
            },
            required: ["min", "max", "currency"],
          },
          productionInsight: {
            type: Type.OBJECT,
            properties: {
              artisans: { type: Type.STRING },
              urduArtisans: { type: Type.STRING },
              days: { type: Type.STRING },
              urduDays: { type: Type.STRING },
            },
            required: ["artisans", "urduArtisans", "days", "urduDays"],
          },
          smartInsight: { type: Type.ARRAY, items: { type: Type.STRING } },
          urduSmartInsight: { type: Type.ARRAY, items: { type: Type.STRING } },
          complexity: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
          annotations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                urduLabel: { type: Type.STRING },
                x: { type: Type.NUMBER },
                y: { type: Type.NUMBER },
              },
              required: ["label", "urduLabel", "x", "y"],
            },
          },
          colors: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: [
          "title", "urduTitle", "embroideryStyles", "craftPlacement",
          "costEstimate", "productionInsight", "smartInsight", "urduSmartInsight",
          "complexity", "annotations", "colors",
        ],
      };

      const prompt = `
        You are NaqshAI, a premium South Asian design consultant and artisan.
        Analyze the provided South Asian outfit image with expert-level detail and provide both English and Urdu (Nastaliq style) content.
        Identify every single embroidery type present. List ALL of them (e.g., zardozi, dabka, resham, jaali/jaal, sequins, stonework/kundan, pitta work, nakshi, marori, kora, tilla, gota, sheesha/mirror work, appliqué/patchwork, sindhi tankay, aari/chain stitch, cross-stitch, phulkari, etc.).
        Avoid mentioning any brand names in the descriptions.
        Identify placement: (e.g., neckline, sleeves, choli/bodice, lehenga panels, heavy geometric borders, dupatta mathapatti).
        BE EXTREMELY VOCAL AND DETAILED: Use descriptive, technical language.
        Provide production insights.
        Provide 'Smart Insights'.
        Provide visual annotations (0-1000 normalized coordinates).
        Extract a primary color palette (hex codes).
        For every text field, provide an accurate Urdu translation in a traditional, sophisticated Nastaliq-friendly tone.
        Cost Guidelines (PKR): Light/Medium: 50,000-150,000 | Heavy/Bridal: 180,000-450,000 | Couture: 500,000+
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: {
          parts: [
            { inlineData: { mimeType: "image/jpeg", data: base64Data } },
            { text: prompt },
          ],
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: ANALYSIS_SCHEMA as any,
        },
      });

      if (!response.text) throw new Error("No response from AI");
      res.json(JSON.parse(response.text));
    } catch (err: any) {
      console.error("API /analyze error:", err);
      res.status(500).json({ error: err?.message || "Failed to analyze image" });
    }
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
