import { AnalysisResult } from "../types";

export async function analyzeSouthAsianOutfit(base64Image: string): Promise<AnalysisResult> {
  console.log("Sending analysis request to server...");

  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ base64Image }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err?.error || `Server error: ${response.status}`);
  }

  return response.json() as Promise<AnalysisResult>;
}
