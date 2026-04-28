import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    // Check both process.env (replaced by Vite define) and import.meta.env (Vite native)
    const apiKey = process.env.GEMINI_API_KEY || (import.meta.env?.VITE_GEMINI_API_KEY as string);
    
    if (!apiKey || apiKey === "undefined") {
      throw new Error("GEMINI_API_KEY is missing. 1. Go to Settings menu. 2. Ensure your secret is named 'GEMINI_API_KEY' or 'Gemini API Key'. 3. Save and refresh the page.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

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

export async function analyzeSouthAsianOutfit(base64Image: string): Promise<AnalysisResult> {
  const prompt = `
    You are NaqshAI, a premium South Asian design consultant and artisan.
    Analyze the provided South Asian outfit image with expert-level detail and provide both English and Urdu (Nastaliq style) content.

    Identify every single embroidery type present. Instead of limiting to 3, list ALL of them (e.g., zardozi, dabka, resham, jaali/jaal, sequins, stonework/kundan, pitta work, nakshi, marori, kora, tilla, gota, sheesha/mirror work, appliqué/patchwork, sindhi tankay, aari/chain stitch, cross-stitch, phulkari, etc.).
    Avoid mentioning any brand names (like Rastah, Sabyasachi, etc.) in the descriptions.
    Identify placement: (e.g., neckline, sleeves, choli/bodice, lehenga panels, heavy geometric borders, dupatta mathapatti).
    BE EXTREMELY VOCAL AND DETAILED: Instead of generic terms like "embellished choli" or "heavy border", use descriptive, technical language. 
       - For the choli/bodice: Describe the motif density, specific materials (e.g., "intricate floral jaal with pitta work and crystal hangings").
       - For borders: Describe the scale (e.g., "wide 10-inch geometric border") and layering techniques (e.g., "velvet appliqué with Tilla Marori edgings").
    Provide production insights.
    Provide 'Smart Insights'.
    Provide visual annotations (0-1000 normalized coordinates). Make sure coordinates are accurately placed on the relevant embroidery parts of the garment.
    Extract a primary color palette (hex codes).
    
    CRITICAL: For every text field, provide an accurate Urdu translation in a traditional, sophisticated Nastaliq-friendly tone. Avoid literal translations; use boutique-appropriate Urdu terminology.

    - Light/Medium: 50,000 - 150,000 PKR
    - Heavy/Bridal: 180,000 - 450,000 PKR
    - Extremely Couture: 500,000+ PKR
  `;

  console.log("Calling Gemini 3 Flash");
  
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image,
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

  if (!response.text) {
    throw new Error("No analysis received from AI.");
  }

  return JSON.parse(response.text) as AnalysisResult;
}
