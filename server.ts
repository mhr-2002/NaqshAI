import express from "express";
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

  // --- Gemini AI Setup (Server-side) ---
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

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
      smartInsight: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
      urduSmartInsight: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
      complexity: {
        type: Type.STRING,
        enum: ["Low", "Medium", "High"],
      },
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
      colors: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Primary colors extracted from the outfit",
      },
    },
    required: [
      "title",
      "urduTitle",
      "embroideryStyles",
      "craftPlacement",
      "costEstimate",
      "productionInsight",
      "smartInsight",
      "urduSmartInsight",
      "complexity",
      "annotations",
      "colors",
    ],
  };

  // API Endpoint for analysis
  app.post("/api/analyze", async (req, res) => {
    try {
      const { image } = req.body;
      if (!image) return res.status(400).json({ error: "Image is required" });

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      const prompt = `
        You are NaqshAI, a premium South Asian design consultant and artisan.
        Analyze the provided South Asian outfit image with expert-level detail and provide both English and Urdu (Nastaliq style) content.

        Identify every single embroidery type present. Instead of limiting to 3, list ALL of them (e.g., zardozi, dabka, resham, jaali/jaal, sequins, stonework/kundan, pitta work, nakshi, marori, kora, tilla, gota, sheesha/mirror work, appliqué/patchwork, sindhi tankay, aari/chain stitch, cross-stitch, phulkari, etc.).
        Avoid mentioning any brand names in the descriptions.
        Identify placement: (e.g., neckline, sleeves, choli/bodice, lehenga panels, heavy geometric borders, dupatta mathapatti).
        BE EXTREMELY VOCAL AND DETAILED...
        - Light/Medium: 50,000 - 150,000 PKR
        - Heavy/Bridal: 180,000 - 450,000 PKR
        - Extremely Couture: 500,000+ PKR
      `;

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash-latest",
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: image,
              },
            },
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

    } catch (error) {
      console.error("AI Analysis Error:", error);
      res.status(500).json({ error: "Failed to analyze image" });
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
    const distPath = path.join(process.cwd(), "dist");
    
    // Serve static files first
    app.use(express.static(distPath));

    // Handle SPA routing
    app.get("*", (req, res) => {
      // API routes should have been handled above
      // If it's a file request that wasn't found by express.static, don't serve index.html
      if (req.path.includes(".")) {
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
