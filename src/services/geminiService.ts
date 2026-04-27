import { AnalysisResult } from "../types";

export async function analyzeSouthAsianOutfit(base64Image: string): Promise<AnalysisResult> {
  console.log("Starting analysis request to server...");
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
