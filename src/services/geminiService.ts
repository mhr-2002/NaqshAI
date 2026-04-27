import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

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

export async function analyzeSouthAsianOutfit(base64Image: string): Promise<AnalysisResult> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image: base64Image }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to analyze image.");
  }

  return response.json();
}
